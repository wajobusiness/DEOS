import { useState, useEffect } from 'react';
import { Member, PlanTier, TreeNode, WalletTransaction, Product, Lead, Deal, Course, EventItem, TeamMember } from '../types';
import { currentUser as defaultUser, initialBinaryTree, initialProducts, initialLeads, initialDeals, initialCourses, initialEvents, initialTeamMembers } from './mockData';

export interface KYCSubmission {
  id: string;
  memberId: string;
  name: string;
  documentType: 'Passport' | 'National ID' | 'Drivers License';
  documentNumber: string;
  submittedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  photoUrl: string;
}

export interface PayoutRequest {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  currency: 'USDT' | 'USD';
  method: 'USDT (TRC20)' | 'Bank Transfer';
  destinationAddress: string;
  requestedAt: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface DomainConfig {
  subdomain: string;
  customDomain: string;
  dnsStatus: 'active' | 'pending' | 'verifying' | 'failed';
  sslStatus: 'active' | 'provisioning' | 'failed';
  domainCreditVoucher: boolean;
  dnsRecords: {
    type: 'A' | 'CNAME' | 'TXT';
    name: string;
    value: string;
    status: 'configured' | 'pending';
  }[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  actor: string;
  actorRole: string;
  timestamp: string;
  details: string;
  impactCategory: 'Financial' | 'Tree Placement' | 'System Config' | 'User Account' | 'Security';
}

export const initialKYCList: KYCSubmission[] = [
  {
    id: 'KYC-801',
    memberId: 'EVO100246',
    name: 'Sarah Johnson',
    documentType: 'Passport',
    documentNumber: 'A9283741',
    submittedAt: 'Today, 08:20 AM',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'KYC-802',
    memberId: 'EVO100247',
    name: 'Michael Brown',
    documentType: 'National ID',
    documentNumber: 'NIN-99210291',
    submittedAt: 'Yesterday, 04:15 PM',
    status: 'Pending',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
];

export const initialPayoutQueue: PayoutRequest[] = [
  {
    id: 'PAY-401',
    memberId: 'EVO100245',
    memberName: 'John Doe',
    amount: 3250.00,
    currency: 'USDT',
    method: 'USDT (TRC20)',
    destinationAddress: 'TX9xZgHkM92pqWrtY8dKl9mTRC20Address',
    requestedAt: 'Today, 10:15 AM',
    status: 'Pending',
  },
  {
    id: 'PAY-402',
    memberId: 'EVO100248',
    memberName: 'Grace John',
    amount: 1420.00,
    currency: 'USDT',
    method: 'USDT (TRC20)',
    destinationAddress: 'TY2m8pLk91QrtY8dKTRC20Address',
    requestedAt: 'Yesterday, 06:30 PM',
    status: 'Pending',
  },
];

export const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    action: 'Commission Rate Audit Check',
    actor: 'Super Admin',
    actorRole: 'super_admin',
    timestamp: 'Today, 11:20 AM',
    details: 'Locked Binary Rate verified at 10% flat per binary compensation invariant.',
    impactCategory: 'Financial',
  },
  {
    id: 'AUD-900',
    action: 'Sustainability Fund Inflow Ingestion',
    actor: 'Automation Engine',
    actorRole: 'system',
    timestamp: 'Today, 10:24 AM',
    details: '+$50.00 credited from Split Commission unearned Launch-to-Legacy gap.',
    impactCategory: 'Financial',
  },
  {
    id: 'AUD-899',
    action: 'Custom Domain SSL Issued',
    actor: 'DNS Worker',
    actorRole: 'system',
    timestamp: 'Yesterday, 08:30 PM',
    details: 'Auto-renewed SSL certificate for johnsonagency.com (Let\'s Encrypt TLS v1.3).',
    impactCategory: 'System Config',
  },
];

export const defaultDomainConfig: DomainConfig = {
  subdomain: 'johndoe.evionaecosystem.com',
  customDomain: 'johnsonagency.com',
  dnsStatus: 'active',
  sslStatus: 'active',
  domainCreditVoucher: true,
  dnsRecords: [
    { type: 'A', name: '@', value: '76.76.21.21', status: 'configured' },
    { type: 'CNAME', name: 'www', value: 'cname.evionaecosystem.com', status: 'configured' },
    { type: 'TXT', name: '@', value: 'eviona-site-verification=9a8d7f6e5c4b', status: 'configured' },
  ],
};

