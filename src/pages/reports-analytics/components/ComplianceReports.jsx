import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ComplianceReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);

  const complianceReports = [
    {
      id: 1,
      title: 'Equal Employment Opportunity (EEO) Report',
      description: 'Annual EEO-1 report showing workforce demographics and diversity metrics',
      status: 'compliant',
      lastGenerated: '2024-08-15',
      nextDue: '2025-03-31',
      category: 'Diversity & Inclusion',
      priority: 'high',
      requirements: [
        'Employee demographic data by job category',
        'Gender and ethnicity breakdown',
        'Pay equity analysis',
        'Hiring and promotion statistics'
      ]
    },
    {
      id: 2,
      title: 'OSHA Safety Compliance Report',
      description: 'Workplace safety incidents, training records, and safety protocol compliance',
      status: 'attention-needed',
      lastGenerated: '2024-08-20',
      nextDue: '2024-09-30',
      category: 'Health & Safety',
      priority: 'high',
      requirements: [
        'Incident reporting and investigation records',
        'Safety training completion rates',
        'Workplace hazard assessments',
        'Emergency response procedures'
      ]
    },
    {
      id: 3,
      title: 'FLSA Overtime Compliance Report',
      description: 'Fair Labor Standards Act compliance for overtime pay and working hours',
      status: 'compliant',
      lastGenerated: '2024-08-25',
      nextDue: '2024-09-25',
      category: 'Labor Standards',
      priority: 'medium',
      requirements: [
        'Overtime hours tracking',
        'Exempt vs non-exempt classification',
        'Minimum wage compliance',
        'Break and meal period records'
      ]
    },
    {
      id: 4,
      title: 'FMLA Leave Compliance Report',
      description: 'Family and Medical Leave Act compliance tracking and employee leave records',
      status: 'compliant',
      lastGenerated: '2024-08-22',
      nextDue: '2024-11-22',
      category: 'Leave Management',
      priority: 'medium',
      requirements: [
        'FMLA eligibility verification',
        'Leave request documentation',
        'Job protection compliance',
        'Return-to-work procedures'
      ]
    },
    {
      id: 5,
      title: 'ADA Accommodation Report',
      description: 'Americans with Disabilities Act compliance and reasonable accommodation tracking',
      status: 'review-required',
      lastGenerated: '2024-08-10',
      nextDue: '2024-12-10',
      category: 'Accessibility',
      priority: 'medium',
      requirements: [
        'Accommodation request tracking',
        'Interactive process documentation',
        'Workplace accessibility audits',
        'Training on disability awareness'
      ]
    },
    {
      id: 6,
      title: 'Data Privacy Compliance Report',
      description: 'GDPR, CCPA, and other data privacy regulation compliance for employee data',
      status: 'compliant',
      lastGenerated: '2024-08-27',
      nextDue: '2024-11-27',
      category: 'Data Privacy',
      priority: 'high',
      requirements: [
        'Data processing inventory',
        'Employee consent records',
        'Data breach incident log',
        'Privacy policy compliance'
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant':
        return 'text-success bg-success/10 border-success/20';
      case 'attention-needed':
        return 'text-error bg-error/10 border-error/20';
      case 'review-required':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'compliant':
        return 'CheckCircle';
      case 'attention-needed':
        return 'AlertTriangle';
      case 'review-required':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleGenerateReport = (reportId) => {
    alert(`Generating compliance report ${reportId}...`);
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
  };

  const handleCloseDetails = () => {
    setSelectedReport(null);
  };

  const complianceStats = {
    total: complianceReports?.length,
    compliant: complianceReports?.filter(r => r?.status === 'compliant')?.length,
    attentionNeeded: complianceReports?.filter(r => r?.status === 'attention-needed')?.length,
    reviewRequired: complianceReports?.filter(r => r?.status === 'review-required')?.length
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="FileText" size={16} className="text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Total Reports</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{complianceStats?.total}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="CheckCircle" size={16} className="text-success" />
            <span className="text-sm font-medium text-muted-foreground">Compliant</span>
          </div>
          <div className="text-2xl font-bold text-success">{complianceStats?.compliant}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="AlertTriangle" size={16} className="text-error" />
            <span className="text-sm font-medium text-muted-foreground">Attention Needed</span>
          </div>
          <div className="text-2xl font-bold text-error">{complianceStats?.attentionNeeded}</div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Clock" size={16} className="text-warning" />
            <span className="text-sm font-medium text-muted-foreground">Review Required</span>
          </div>
          <div className="text-2xl font-bold text-warning">{complianceStats?.reviewRequired}</div>
        </div>
      </div>
      {/* Compliance Reports List */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-foreground">Compliance Reports</h3>
          </div>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
          >
            Export All Reports
          </Button>
        </div>

        <div className="space-y-4">
          {complianceReports?.map((report) => (
            <div key={report?.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 micro-transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-foreground">{report?.title}</h4>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(report?.status)}`}>
                      <Icon name={getStatusIcon(report?.status)} size={12} />
                      <span className="capitalize">{report?.status?.replace('-', ' ')}</span>
                    </span>
                    <span className={`text-xs font-medium ${getPriorityColor(report?.priority)}`}>
                      {report?.priority?.toUpperCase()} PRIORITY
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{report?.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-foreground">Category:</span>
                      <span className="ml-2 text-muted-foreground">{report?.category}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Last Generated:</span>
                      <span className="ml-2 text-muted-foreground">{new Date(report.lastGenerated)?.toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Next Due:</span>
                      <span className="ml-2 text-muted-foreground">{new Date(report.nextDue)?.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="Eye"
                    onClick={() => handleViewDetails(report)}
                  >
                    View
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    iconName="FileText"
                    onClick={() => handleGenerateReport(report?.id)}
                  >
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Upcoming Deadlines */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Icon name="Calendar" size={20} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Upcoming Deadlines</h3>
        </div>

        <div className="space-y-3">
          {complianceReports?.sort((a, b) => new Date(a.nextDue) - new Date(b.nextDue))?.slice(0, 5)?.map((report) => {
              const daysUntilDue = Math.ceil((new Date(report.nextDue) - new Date()) / (1000 * 60 * 60 * 24));
              const isOverdue = daysUntilDue < 0;
              const isUrgent = daysUntilDue <= 7 && daysUntilDue >= 0;

              return (
                <div key={report?.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={isOverdue ? "AlertTriangle" : isUrgent ? "Clock" : "Calendar"} 
                      size={16} 
                      className={isOverdue ? "text-error" : isUrgent ? "text-warning" : "text-primary"} 
                    />
                    <div>
                      <div className="font-medium text-foreground">{report?.title}</div>
                      <div className="text-sm text-muted-foreground">{report?.category}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-medium ${isOverdue ? "text-error" : isUrgent ? "text-warning" : "text-foreground"}`}>
                      {isOverdue ? `${Math.abs(daysUntilDue)} days overdue` : 
                       daysUntilDue === 0 ? "Due today" :
                       `${daysUntilDue} days remaining`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {new Date(report.nextDue)?.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">{selectedReport?.title}</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDetails}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{selectedReport?.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Status</h3>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedReport?.status)}`}>
                    <Icon name={getStatusIcon(selectedReport?.status)} size={12} />
                    <span className="capitalize">{selectedReport?.status?.replace('-', ' ')}</span>
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Priority</h3>
                  <span className={`text-sm font-medium ${getPriorityColor(selectedReport?.priority)}`}>
                    {selectedReport?.priority?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-foreground mb-2">Requirements</h3>
                <ul className="space-y-2">
                  {selectedReport?.requirements?.map((req, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Icon name="Check" size={16} className="text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={handleCloseDetails}
                >
                  Close
                </Button>
                <Button
                  variant="default"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => handleGenerateReport(selectedReport?.id)}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceReports;