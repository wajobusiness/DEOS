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

export const initialKYCList: KYCSubmission[] = [];

export const initialPayoutQueue: PayoutRequest[] = [];

export const initialAuditLogs: AuditLogEntry[] = [];

export const defaultDomainConfig: DomainConfig = {
  subdomain: '',
  customDomain: '',
  dnsStatus: 'pending',
  sslStatus: 'provisioning',
  domainCreditVoucher: true,
  dnsRecords: [
    { type: 'A', name: '@', value: '76.76.21.21', status: 'pending' },
    { type: 'CNAME', name: 'www', value: 'cname.evionaecosystem.com', status: 'pending' },
    { type: 'TXT', name: '@', value: 'eviona-site-verification=pending', status: 'pending' },
  ],
};

