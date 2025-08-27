-- Location: supabase/migrations/20250827062312_hrms_system_complete.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete HRMS system with authentication
-- Dependencies: auth.users (Supabase provided)

-- 1. ENUMS AND TYPES (with public. qualification)
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('admin', 'hr_manager', 'employee', 'department_head');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE public.employee_status AS ENUM ('active', 'inactive', 'terminated', 'on_leave');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'on_leave');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE public.leave_type AS ENUM ('sick', 'vacation', 'personal', 'maternity', 'emergency');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE public.leave_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN
    CREATE TYPE public.payroll_status AS ENUM ('draft', 'processed', 'paid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. CORE TABLES (no foreign keys first)

-- Critical intermediary table for PostgREST compatibility
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'employee'::public.user_role,
    avatar_url TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Company structure
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    head_id UUID, -- Will add foreign key after employees table
    budget DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Job positions
CREATE TABLE IF NOT EXISTS public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    description TEXT,
    min_salary DECIMAL(12,2),
    max_salary DECIMAL(12,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. DEPENDENT TABLES (with foreign keys)

-- Employee information
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    employee_id TEXT NOT NULL UNIQUE, -- Company employee ID
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    position_id UUID REFERENCES public.positions(id) ON DELETE SET NULL,
    manager_id UUID, -- Self-reference, will add constraint later
    hire_date DATE NOT NULL,
    salary DECIMAL(12,2),
    status public.employee_status DEFAULT 'active'::public.employee_status,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Add self-reference for manager
ALTER TABLE public.employees DROP CONSTRAINT IF EXISTS fk_employees_manager;
ALTER TABLE public.employees ADD CONSTRAINT fk_employees_manager 
FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON DELETE SET NULL;

-- Add department head reference
ALTER TABLE public.departments DROP CONSTRAINT IF EXISTS fk_departments_head;
ALTER TABLE public.departments ADD CONSTRAINT fk_departments_head
FOREIGN KEY (head_id) REFERENCES public.employees(id) ON DELETE SET NULL;

-- Attendance tracking
CREATE TABLE IF NOT EXISTS public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    status public.attendance_status DEFAULT 'present'::public.attendance_status,
    work_hours DECIMAL(4,2), -- Calculated work hours
    break_hours DECIMAL(4,2) DEFAULT 0,
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Leave requests
CREATE TABLE IF NOT EXISTS public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type public.leave_type NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested INTEGER NOT NULL,
    reason TEXT,
    status public.leave_status DEFAULT 'pending'::public.leave_status,
    approved_by UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Payroll management
CREATE TABLE IF NOT EXISTS public.payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    base_salary DECIMAL(12,2) NOT NULL,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    bonus DECIMAL(12,2) DEFAULT 0,
    deductions DECIMAL(12,2) DEFAULT 0,
    tax_deduction DECIMAL(12,2) DEFAULT 0,
    gross_pay DECIMAL(12,2) NOT NULL,
    net_pay DECIMAL(12,2) NOT NULL,
    status public.payroll_status DEFAULT 'draft'::public.payroll_status,
    processed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System alerts and notifications
CREATE TABLE IF NOT EXISTS public.system_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    alert_type TEXT DEFAULT 'info', -- info, warning, error, success
    is_active BOOLEAN DEFAULT true,
    target_roles public.user_role[] DEFAULT ARRAY['admin', 'hr_manager']::public.user_role[],
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. ESSENTIAL INDEXES
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_employees_user_id ON public.employees(user_id);
CREATE INDEX IF NOT EXISTS idx_employees_department_id ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager_id ON public.employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON public.employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON public.attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON public.attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee_id ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_payroll_employee_id ON public.payroll(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_period ON public.payroll(pay_period_start, pay_period_end);

-- 5. FUNCTIONS (BEFORE RLS POLICIES)

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'employee')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function for admin role checking
CREATE OR REPLACE FUNCTION public.is_admin_from_auth()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM auth.users au
    WHERE au.id = auth.uid() 
    AND (au.raw_user_meta_data->>'role' IN ('admin', 'hr_manager')
         OR au.raw_app_meta_data->>'role' IN ('admin', 'hr_manager'))
)
$$;

-- Function for HR role checking
CREATE OR REPLACE FUNCTION public.is_hr_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('admin', 'hr_manager', 'department_head')
    AND up.is_active = true
)
$$;

-- Function to calculate work hours
CREATE OR REPLACE FUNCTION public.calculate_work_hours()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.check_in_time IS NOT NULL AND NEW.check_out_time IS NOT NULL THEN
        NEW.work_hours := EXTRACT(EPOCH FROM (NEW.check_out_time - NEW.check_in_time)) / 3600 - COALESCE(NEW.break_hours, 0);
        
        -- Calculate overtime (assuming 8-hour workday)
        IF NEW.work_hours > 8 THEN
            NEW.overtime_hours := NEW.work_hours - 8;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- 6. ENABLE RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES (following the 7-pattern system)

-- Pattern 1: Core user table (user_profiles) - Simple only, no functions
DROP POLICY IF EXISTS "users_manage_own_user_profiles" ON public.user_profiles;
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 6: Role-based access for departments (admin/HR can manage all)
DROP POLICY IF EXISTS "hr_manage_all_departments" ON public.departments;
CREATE POLICY "hr_manage_all_departments"
ON public.departments
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "employees_view_departments" ON public.departments;
CREATE POLICY "employees_view_departments"
ON public.departments
FOR SELECT
TO authenticated
USING (is_active = true);

-- Pattern 6: Role-based access for positions
DROP POLICY IF EXISTS "hr_manage_all_positions" ON public.positions;
CREATE POLICY "hr_manage_all_positions"
ON public.positions
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "employees_view_positions" ON public.positions;
CREATE POLICY "employees_view_positions"
ON public.positions
FOR SELECT
TO authenticated
USING (is_active = true);

-- Pattern 2: Simple user ownership for employees (users can view their own record)
DROP POLICY IF EXISTS "users_view_own_employee_record" ON public.employees;
CREATE POLICY "users_view_own_employee_record"
ON public.employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Pattern 6: HR can manage all employee records
DROP POLICY IF EXISTS "hr_manage_all_employees" ON public.employees;
CREATE POLICY "hr_manage_all_employees"
ON public.employees
FOR ALL
TO authenticated
USING (public.is_hr_user())
WITH CHECK (public.is_hr_user());

-- Pattern 2: Simple user ownership for attendance
DROP POLICY IF EXISTS "users_manage_own_attendance" ON public.attendance;
CREATE POLICY "users_manage_own_attendance"
ON public.attendance
FOR ALL
TO authenticated
USING (
    employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
);

-- Pattern 6: HR can view all attendance
DROP POLICY IF EXISTS "hr_view_all_attendance" ON public.attendance;
CREATE POLICY "hr_view_all_attendance"
ON public.attendance
FOR SELECT
TO authenticated
USING (public.is_hr_user());

-- Pattern 2: Simple user ownership for leave requests
DROP POLICY IF EXISTS "users_manage_own_leave_requests" ON public.leave_requests;
CREATE POLICY "users_manage_own_leave_requests"
ON public.leave_requests
FOR ALL
TO authenticated
USING (
    employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
);

-- Pattern 6: HR can manage all leave requests
DROP POLICY IF EXISTS "hr_manage_all_leave_requests" ON public.leave_requests;
CREATE POLICY "hr_manage_all_leave_requests"
ON public.leave_requests
FOR ALL
TO authenticated
USING (public.is_hr_user())
WITH CHECK (public.is_hr_user());

-- Pattern 6: Role-based access for payroll (HR only)
DROP POLICY IF EXISTS "hr_manage_all_payroll" ON public.payroll;
CREATE POLICY "hr_manage_all_payroll"
ON public.payroll
FOR ALL
TO authenticated
USING (public.is_hr_user())
WITH CHECK (public.is_hr_user());

-- Employees can view their own payroll
DROP POLICY IF EXISTS "users_view_own_payroll" ON public.payroll;
CREATE POLICY "users_view_own_payroll"
ON public.payroll
FOR SELECT
TO authenticated
USING (
    employee_id IN (
        SELECT id FROM public.employees WHERE user_id = auth.uid()
    )
);

-- Pattern 6: Role-based access for system alerts
DROP POLICY IF EXISTS "admins_manage_system_alerts" ON public.system_alerts;
CREATE POLICY "admins_manage_system_alerts"
ON public.system_alerts
FOR ALL
TO authenticated
USING (public.is_admin_from_auth())
WITH CHECK (public.is_admin_from_auth());

DROP POLICY IF EXISTS "users_view_relevant_alerts" ON public.system_alerts;
CREATE POLICY "users_view_relevant_alerts"
ON public.system_alerts
FOR SELECT
TO authenticated
USING (
    is_active = true AND 
    (target_roles IS NULL OR 
     (SELECT role FROM public.user_profiles WHERE id = auth.uid()) = ANY(target_roles))
);

-- 8. TRIGGERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS calculate_work_hours_trigger ON public.attendance;
CREATE TRIGGER calculate_work_hours_trigger
    BEFORE INSERT OR UPDATE ON public.attendance
    FOR EACH ROW
    EXECUTE FUNCTION public.calculate_work_hours();

-- 9. MOCK DATA
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    hr_manager_uuid UUID := gen_random_uuid();
    employee1_uuid UUID := gen_random_uuid();
    employee2_uuid UUID := gen_random_uuid();
    dept_it_id UUID := gen_random_uuid();
    dept_hr_id UUID := gen_random_uuid();
    pos_dev_id UUID := gen_random_uuid();
    pos_hr_id UUID := gen_random_uuid();
    emp1_id UUID := gen_random_uuid();
    emp2_id UUID := gen_random_uuid();
    emp3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@company.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "System Administrator", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"], "role": "admin"}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (hr_manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'hr@company.com', crypt('hr123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "HR Manager", "role": "hr_manager"}'::jsonb,
         '{"provider": "email", "providers": ["email"], "role": "hr_manager"}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (employee1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'john@company.com', crypt('employee123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Doe", "role": "employee"}'::jsonb,
         '{"provider": "email", "providers": ["email"], "role": "employee"}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (employee2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'jane@company.com', crypt('employee123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Jane Smith", "role": "employee"}'::jsonb,
         '{"provider": "email", "providers": ["email"], "role": "employee"}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create departments
    INSERT INTO public.departments (id, name, description, budget) VALUES
        (dept_it_id, 'Information Technology', 'Software development and IT infrastructure', 500000.00),
        (dept_hr_id, 'Human Resources', 'Employee management and organizational development', 250000.00);

    -- Create positions
    INSERT INTO public.positions (id, title, department_id, description, min_salary, max_salary) VALUES
        (pos_dev_id, 'Software Developer', dept_it_id, 'Full-stack software development', 60000.00, 100000.00),
        (pos_hr_id, 'HR Specialist', dept_hr_id, 'Human resources management and support', 45000.00, 75000.00);

    -- Create employees
    INSERT INTO public.employees (id, user_id, employee_id, department_id, position_id, hire_date, salary, status) VALUES
        (emp1_id, admin_uuid, 'EMP001', dept_it_id, pos_dev_id, '2024-01-15', 85000.00, 'active'),
        (emp2_id, hr_manager_uuid, 'EMP002', dept_hr_id, pos_hr_id, '2024-02-01', 65000.00, 'active'),
        (emp3_id, employee1_uuid, 'EMP003', dept_it_id, pos_dev_id, '2024-03-01', 70000.00, 'active');

    -- Update department heads
    UPDATE public.departments SET head_id = emp1_id WHERE id = dept_it_id;
    UPDATE public.departments SET head_id = emp2_id WHERE id = dept_hr_id;

    -- Create sample attendance records
    INSERT INTO public.attendance (employee_id, attendance_date, check_in_time, check_out_time, status, break_hours) VALUES
        (emp1_id, CURRENT_DATE - INTERVAL '1 day', 
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '9 hours'), 
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '17 hours'), 
         'present', 1.0),
        (emp2_id, CURRENT_DATE - INTERVAL '1 day',
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '8:30 hours'),
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '16:30 hours'),
         'present', 1.0),
        (emp3_id, CURRENT_DATE - INTERVAL '1 day',
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '9:15 hours'),
         (CURRENT_DATE - INTERVAL '1 day' + INTERVAL '17:45 hours'),
         'late', 1.0);

    -- Create sample leave requests
    INSERT INTO public.leave_requests (employee_id, leave_type, start_date, end_date, days_requested, reason, status, approved_by) VALUES
        (emp3_id, 'vacation', CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '9 days', 3, 'Family vacation', 'approved', emp2_id);

    -- Create sample payroll
    INSERT INTO public.payroll (employee_id, pay_period_start, pay_period_end, base_salary, overtime_pay, gross_pay, net_pay, status, processed_by) VALUES
        (emp1_id, DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'), 
         (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day'),
         7083.33, 200.00, 7283.33, 5826.66, 'paid', hr_manager_uuid),
        (emp2_id, DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month'),
         (DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 day'),
         5416.67, 0.00, 5416.67, 4333.34, 'paid', hr_manager_uuid);

    -- Create system alerts
    INSERT INTO public.system_alerts (title, message, alert_type, target_roles, created_by) VALUES
        ('Welcome to HRMS', 'The new HR Management System is now live!', 'info', 
         ARRAY['admin', 'hr_manager', 'employee']::public.user_role[], admin_uuid),
        ('Payroll Processing', 'Monthly payroll processing will begin tomorrow', 'warning',
         ARRAY['admin', 'hr_manager']::public.user_role[], hr_manager_uuid);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;

-- 10. CLEANUP FUNCTION
CREATE OR REPLACE FUNCTION public.cleanup_hrms_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@company.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.system_alerts WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.payroll WHERE employee_id IN (SELECT id FROM public.employees WHERE user_id = ANY(auth_user_ids_to_delete));
    DELETE FROM public.leave_requests WHERE employee_id IN (SELECT id FROM public.employees WHERE user_id = ANY(auth_user_ids_to_delete));
    DELETE FROM public.attendance WHERE employee_id IN (SELECT id FROM public.employees WHERE user_id = ANY(auth_user_ids_to_delete));
    DELETE FROM public.employees WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.positions;
    DELETE FROM public.departments;
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;

-- Remove or comment out any extra foreign key constraints from employees to departments except the main one you want to use for embedding.
-- For example, if you have both department_id and secondary_department_id referencing departments, keep only the main one:
-- ALTER TABLE employees DROP CONSTRAINT employees_secondary_department_id_fkey;
-- Or, if you want to keep both, you must alias them in your queries and not use ambiguous embedding.
--
-- Example: Only one foreign key from employees to departments should remain:
-- ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_secondary_department_id_fkey;
--
-- If you want to keep both, update your Supabase queries to specify which relationship to embed.