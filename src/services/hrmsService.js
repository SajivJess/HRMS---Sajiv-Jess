import { supabase } from '../lib/supabase';

// Employee Management Service
export const employeeService = {
  // Get all employees with departments and positions
  async getEmployees() {
    try {
      const { data, error } = await supabase?.from('employees')?.select(`
          *,
          departments:department_id (
            *,
            head:employees!head_id (
              user_profiles (
                full_name
              )
            )
          ),
          positions:position_id (
            *,
            departments (
              name
            )
          ),
          user_profiles:user_id (
            full_name,
            email,
            avatar_url,
            phone
          ),
          manager:employees!manager_id (
            user_profiles (
              full_name
            )
          )
        `)?.order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching employees:', error)
      throw error
    }
  },

  // Get employee by ID
  async getEmployeeById(employeeId) {
    try {
      const { data, error } = await supabase?.from('employees')?.select(`
          *,
          departments:department_id (
            id,
            name
          ),
          positions:position_id (
            id,
            title
          ),
          user_profiles:user_id (
            full_name,
            email,
            avatar_url,
            phone
          )
        `)?.eq('id', employeeId)?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error fetching employee:', error)
      throw error
    }
  },

  // Create new employee
  async createEmployee(employeeData) {
    try {
      const { data, error } = await supabase?.from('employees')?.insert([employeeData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating employee:', error)
      throw error
    }
  },

  // Update employee
  async updateEmployee(employeeId, updates) {
    try {
      const { data, error } = await supabase?.from('employees')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', employeeId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating employee:', error)
      throw error
    }
  },

  // Delete employee
  async deleteEmployee(employeeId) {
    try {
      const { error } = await supabase?.from('employees')?.delete()?.eq('id', employeeId)

      if (error) {
        throw error
      }

      return true
    } catch (error) {
      console.error('Error deleting employee:', error)
      throw error
    }
  }
}

// Attendance Service
export const attendanceService = {
  // Get attendance records
  async getAttendance(filters = {}) {
    try {
      let query = supabase?.from('attendance')?.select(`
          *,
          employees (
            employee_id,
            user_profiles (
              full_name
            )
          )
        `)?.order('attendance_date', { ascending: false })

      // Apply filters
      if (filters?.employeeId) {
        query = query?.eq('employee_id', filters?.employeeId)
      }
      if (filters?.startDate) {
        query = query?.gte('attendance_date', filters?.startDate)
      }
      if (filters?.endDate) {
        query = query?.lte('attendance_date', filters?.endDate)
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching attendance:', error)
      throw error
    }
  },

  // Check in
  async checkIn(employeeId) {
    try {
      const today = new Date()?.toISOString()?.split('T')?.[0]
      
      // Check if already checked in today
      const { data: existing } = await supabase?.from('attendance')?.select('id')?.eq('employee_id', employeeId)?.eq('attendance_date', today)?.single()

      if (existing) {
        throw new Error('Already checked in today')
      }

      const { data, error } = await supabase?.from('attendance')?.insert([{
          employee_id: employeeId,
          attendance_date: today,
          check_in_time: new Date()?.toISOString(),
          status: 'present'
        }])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error checking in:', error)
      throw error
    }
  },

  // Check out
  async checkOut(employeeId) {
    try {
      const today = new Date()?.toISOString()?.split('T')?.[0]
      
      const { data, error } = await supabase?.from('attendance')?.update({
          check_out_time: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        })?.eq('employee_id', employeeId)?.eq('attendance_date', today)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error checking out:', error)
      throw error
    }
  },

  // Manual attendance correction
  async correctAttendance(attendanceId, updates) {
    try {
      const { data, error } = await supabase?.from('attendance')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', attendanceId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error correcting attendance:', error)
      throw error
    }
  }
}

// Leave Management Service
export const leaveService = {
  // Get leave requests
  async getLeaveRequests(filters = {}) {
    try {
      let query = supabase?.from('leave_requests')?.select(`
          *,
          employees (
            employee_id,
            user_profiles (
              full_name
            )
          ),
          approved_by_employee:employees!approved_by (
            user_profiles (
              full_name
            )
          )
        `)?.order('created_at', { ascending: false })

      if (filters?.employeeId) {
        query = query?.eq('employee_id', filters?.employeeId)
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching leave requests:', error)
      throw error
    }
  },

  // Submit leave request
  async submitLeaveRequest(leaveData) {
    try {
      // Calculate days requested
      const startDate = new Date(leaveData.start_date)
      const endDate = new Date(leaveData.end_date)
      const daysRequested = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1

      const { data, error } = await supabase?.from('leave_requests')?.insert([{
          ...leaveData,
          days_requested: daysRequested,
          status: 'pending'
        }])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error submitting leave request:', error)
      throw error
    }
  },

  // Approve/reject leave request
  async updateLeaveRequest(leaveId, status, approvedBy, rejectionReason = null) {
    try {
      const updates = {
        status,
        approved_by: approvedBy,
        approved_at: new Date()?.toISOString(),
        updated_at: new Date()?.toISOString()
      }

      if (rejectionReason) {
        updates.rejection_reason = rejectionReason
      }

      const { data, error } = await supabase?.from('leave_requests')?.update(updates)?.eq('id', leaveId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating leave request:', error)
      throw error
    }
  }
}

// Payroll Service
export const payrollService = {
  // Get payroll records
  async getPayroll(filters = {}) {
    try {
      let query = supabase?.from('payroll')?.select(`
          *,
          employees (
            employee_id,
            user_profiles (
              full_name
            )
          ),
          processed_by_profile:user_profiles!processed_by (
            full_name
          )
        `)?.order('pay_period_start', { ascending: false })

      if (filters?.employeeId) {
        query = query?.eq('employee_id', filters?.employeeId)
      }
      if (filters?.status) {
        query = query?.eq('status', filters?.status)
      }
      if (filters?.payPeriodStart) {
        query = query?.gte('pay_period_start', filters?.payPeriodStart)
      }
      if (filters?.payPeriodEnd) {
        query = query?.lte('pay_period_end', filters?.payPeriodEnd)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching payroll:', error)
      throw error
    }
  },

  // Create payroll record
  async createPayroll(payrollData) {
    try {
      // Calculate gross and net pay
      const grossPay = payrollData?.base_salary + (payrollData?.overtime_pay || 0) + (payrollData?.bonus || 0)
      const netPay = grossPay - (payrollData?.deductions || 0) - (payrollData?.tax_deduction || 0)

      const { data, error } = await supabase?.from('payroll')?.insert([{
          ...payrollData,
          gross_pay: grossPay,
          net_pay: netPay,
          status: 'draft'
        }])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating payroll:', error)
      throw error
    }
  },

  // Update payroll record
  async updatePayroll(payrollId, updates) {
    try {
      // Recalculate if financial data changed
      if (updates?.base_salary || updates?.overtime_pay || updates?.bonus || updates?.deductions || updates?.tax_deduction) {
        const grossPay = (updates?.base_salary || 0) + (updates?.overtime_pay || 0) + (updates?.bonus || 0)
        const netPay = grossPay - (updates?.deductions || 0) - (updates?.tax_deduction || 0)
        updates.gross_pay = grossPay
        updates.net_pay = netPay
      }

      const { data, error } = await supabase?.from('payroll')?.update(updates)?.eq('id', payrollId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error updating payroll:', error)
      throw error
    }
  },

  // Process payroll (mark as processed)
  async processPayroll(payrollId, processedBy) {
    try {
      const { data, error } = await supabase?.from('payroll')?.update({
          status: 'processed',
          processed_by: processedBy,
          processed_at: new Date()?.toISOString()
        })?.eq('id', payrollId)?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error processing payroll:', error)
      throw error
    }
  }
}

// Department and Position Service
export const organizationService = {
  // Get departments
  async getDepartments() {
    try {
      const { data, error } = await supabase?.from('departments')?.select(`
          *,
          head:employees!head_id (
            user_profiles (
              full_name
            )
          )
        `)?.order('name')

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching departments:', error)
      throw error
    }
  },

  // Get positions
  async getPositions() {
    try {
      const { data, error } = await supabase?.from('positions')?.select(`
          *,
          departments (
            name
          )
        `)?.order('title')

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching positions:', error)
      throw error
    }
  },

  // Create department
  async createDepartment(departmentData) {
    try {
      const { data, error } = await supabase?.from('departments')?.insert([departmentData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating department:', error)
      throw error
    }
  },

  // Create position
  async createPosition(positionData) {
    try {
      const { data, error } = await supabase?.from('positions')?.insert([positionData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating position:', error)
      throw error
    }
  }
}

// Analytics Service
export const analyticsService = {
  // Get dashboard KPIs
  async getDashboardKPIs() {
    try {
      // Get total employees
      const { count: totalEmployees, error: empError } = await supabase?.from('employees')?.select('*', { count: 'exact', head: true })?.eq('status', 'active')

      if (empError) throw empError

      // Get today's attendance
      const today = new Date()?.toISOString()?.split('T')?.[0]
      const { count: presentToday, error: attError } = await supabase?.from('attendance')?.select('*', { count: 'exact', head: true })?.eq('attendance_date', today)?.eq('status', 'present')

      if (attError) throw attError

      // Get pending leave requests
      const { count: pendingLeaves, error: leaveError } = await supabase?.from('leave_requests')?.select('*', { count: 'exact', head: true })?.eq('status', 'pending')

      if (leaveError) throw leaveError

      // Get this month's processed payroll
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)?.toISOString()?.split('T')?.[0]
      const { count: payrollProcessed, error: payError } = await supabase?.from('payroll')?.select('*', { count: 'exact', head: true })?.eq('status', 'processed')?.gte('pay_period_start', startOfMonth)

      if (payError) throw payError

      return {
        totalEmployees: totalEmployees || 0,
        presentToday: presentToday || 0,
        pendingLeaves: pendingLeaves || 0,
        payrollProcessed: payrollProcessed || 0,
        attendanceRate: totalEmployees > 0 ? ((presentToday / totalEmployees) * 100)?.toFixed(1) : 0
      };
    } catch (error) {
      console.error('Error fetching dashboard KPIs:', error)
      throw error
    }
  },

  // Get attendance statistics
  async getAttendanceStats(period = '30') {
    try {
      const startDate = new Date()
      startDate?.setDate(startDate?.getDate() - parseInt(period))
      
      const { data, error } = await supabase?.from('attendance')?.select('attendance_date, status')?.gte('attendance_date', startDate?.toISOString()?.split('T')?.[0])?.order('attendance_date')

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Error fetching attendance stats:', error)
      throw error
    }
  }
}

// System Alerts Service
export const alertsService = {
  // Get system alerts for current user
  async getSystemAlerts() {
    try {
      const { data, error } = await supabase?.from('system_alerts')?.select(`
          *,
          created_by_profile:user_profiles!created_by (
            full_name
          )
        `)?.eq('is_active', true)?.order('created_at', { ascending: false })?.limit(10)

      if (error) {
        throw error
      }

      return data || []
    } catch (error) {
      console.error('Error fetching system alerts:', error)
      throw error
    }
  },

  // Create system alert
  async createAlert(alertData) {
    try {
      const { data, error } = await supabase?.from('system_alerts')?.insert([alertData])?.select()?.single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error('Error creating alert:', error)
      throw error
    }
  }
}