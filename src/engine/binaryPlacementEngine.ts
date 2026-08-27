import { PlanTier, TreeNode } from '../types';
import { userRegistryEngine, RegisteredUser } from './userRegistryEngine';
import { calculateBinaryCommission } from './binaryEngine';

export interface BinaryPlacementRecord {
  id: string; // e.g. BIN-POS-10001
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  parentId: string | null; // Direct binary tree parent
  position: 'left' | 'right' | 'root';
  level: number;
  bv: number; // Volume contributed by this node
  plan: PlanTier;
  status: 'active' | 'inactive';
  sponsorId: string; // Direct referral sponsor
  sponsorName: string;
  createdAt: string;
}

const STORAGE_BINARY_POSITIONS_KEY = 'eviona_binary_positions_v4';

export const binaryPlacementEngine = {
  // 1. Initialize default foundational placements
  initDefaults(): BinaryPlacementRecord[] {
    const defaults: BinaryPlacementRecord[] = [
      {
        id: 'BIN-POS-000001',
        userId: 'EVO-ID-000001',
        userName: 'System Administrator',
        userEmail: 'admin@evionaecosystem.com',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        parentId: null,
        position: 'root',
        level: 0,
        bv: 0,
        plan: 'legacy',
        status: 'active',
        sponsorId: 'EVO-ID-000001',
        sponsorName: 'System Root',
        createdAt: new Date().toISOString(),
      }
    ];

    try {
      const existing = localStorage.getItem(STORAGE_BINARY_POSITIONS_KEY);
      if (!existing) {
        localStorage.setItem(STORAGE_BINARY_POSITIONS_KEY, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(existing);
    } catch {
      return defaults;
    }
  },

  // 2. Fetch all binary positions
  getAllPlacements(): BinaryPlacementRecord[] {
    try {
      const saved = localStorage.getItem(STORAGE_BINARY_POSITIONS_KEY);
      if (saved) {
        const placements = JSON.parse(saved);
        if (Array.isArray(placements) && placements.length > 0) {
          return placements;
        }
      }
    } catch {}
    return this.initDefaults();
  },

  // 3. Save placements
  savePlacements(placements: BinaryPlacementRecord[]) {
    try {
      localStorage.setItem(STORAGE_BINARY_POSITIONS_KEY, JSON.stringify(placements));
    } catch (e) {
      console.warn('Failed to save binary placements:', e);
    }
  },

  // 4. Get placement for a specific user
  getPlacementForUser(userId: string): BinaryPlacementRecord | undefined {
    const placements = this.getAllPlacements();
    return placements.find(p => p.userId === userId);
  },

  // 5. Calculate Volume for Plan Tier
  getPlanBV(plan: PlanTier): number {
    switch (plan) {
      case 'launch': return 100;
      case 'growth': return 300;
      case 'legacy': return 500;
      default: return 100;
    }
  },

  // 6. Place a new user into the binary tree (Auto-Spillover or Leg Directed)
  placeUserInBinaryTree(data: {
    userId: string;
    userName: string;
    userEmail: string;
    userAvatar?: string;
    sponsorId: string;
    sponsorName?: string;
    plan: PlanTier;
    preferredLeg?: 'left' | 'right' | 'auto';
  }): BinaryPlacementRecord {
    const placements = this.getAllPlacements();

    // Check if already placed
    const existing = placements.find(p => p.userId === data.userId);
    if (existing) {
      return existing;
    }

    // Ensure root exists
    if (placements.length === 0) {
      this.initDefaults();
    }

    const sponsorId = data.sponsorId || 'EVO-ID-000001';
    let parentNode = placements.find(p => p.userId === sponsorId) || placements[0];

    // Determine preferred leg
    let targetLeg: 'left' | 'right' = 'left';
    if (data.preferredLeg === 'right') {
      targetLeg = 'right';
    } else if (data.preferredLeg === 'left') {
      targetLeg = 'left';
    } else {
      // Auto: Choose leg with lower volume
      const leftChild = placements.find(p => p.parentId === parentNode.userId && p.position === 'left');
      const rightChild = placements.find(p => p.parentId === parentNode.userId && p.position === 'right');
      if (!leftChild) targetLeg = 'left';
      else if (!rightChild) targetLeg = 'right';
      else targetLeg = 'left';
    }

    // BFS Search for available placement slot under parentNode along target branch
    let targetParentId = parentNode.userId;
    let targetPosition: 'left' | 'right' = targetLeg;
    let targetLevel = parentNode.level + 1;

    // Check direct slot
    const directChild = placements.find(p => p.parentId === targetParentId && p.position === targetLeg);
    if (!directChild) {
      targetPosition = targetLeg;
    } else {
      // Spillover traversal down the chosen leg
      const queue: string[] = [directChild.userId];
      let found = false;

      while (queue.length > 0 && !found) {
        const currId = queue.shift()!;
        const currPlacement = placements.find(p => p.userId === currId);
        const currLevel = currPlacement ? currPlacement.level : targetLevel;

        const left = placements.find(p => p.parentId === currId && p.position === 'left');
        const right = placements.find(p => p.parentId === currId && p.position === 'right');

        if (!left) {
          targetParentId = currId;
          targetPosition = 'left';
          targetLevel = currLevel + 1;
          found = true;
          break;
        } else {
          queue.push(left.userId);
        }

        if (!right) {
          targetParentId = currId;
          targetPosition = 'right';
          targetLevel = currLevel + 1;
          found = true;
          break;
        } else {
          queue.push(right.userId);
        }
      }
    }

    const nodeBV = this.getPlanBV(data.plan);
    const newPlacement: BinaryPlacementRecord = {
      id: `BIN-POS-${Math.floor(100000 + Math.random() * 900000)}`,
      userId: data.userId,
      userName: data.userName,
      userEmail: data.userEmail,
      userAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      parentId: targetParentId,
      position: targetPosition,
      level: targetLevel,
      bv: nodeBV,
      plan: data.plan,
      status: 'active',
      sponsorId: data.sponsorId,
      sponsorName: data.sponsorName || 'Eviona Sponsor',
      createdAt: new Date().toISOString(),
    };

    placements.push(newPlacement);
    this.savePlacements(placements);

    // Propagate BV up the binary ancestor chain
    this.propagateVolumeUpline(targetParentId, targetPosition, nodeBV);

    return newPlacement;
  },

  // 7. Propagate BV volume upline to ancestors
  propagateVolumeUpline(parentId: string | null, position: 'left' | 'right', bv: number) {
    if (!parentId || bv <= 0) return;
    const placements = this.getAllPlacements();
    let currentParentId: string | null = parentId;
    let currentPos: 'left' | 'right' = position;

    while (currentParentId) {
      const parentUser = userRegistryEngine.getUserById(currentParentId);
      if (parentUser) {
        if (currentPos === 'left') {
          parentUser.binaryLeftVolume = (parentUser.binaryLeftVolume || 0) + bv;
        } else {
          parentUser.binaryRightVolume = (parentUser.binaryRightVolume || 0) + bv;
        }
        userRegistryEngine.updateUser(parentUser.id, {
          binaryLeftVolume: parentUser.binaryLeftVolume,
          binaryRightVolume: parentUser.binaryRightVolume,
        });
      }

      // Move up to next parent
      const parentPlacement = placements.find(p => p.userId === currentParentId);
      if (parentPlacement && parentPlacement.parentId) {
        currentPos = parentPlacement.position === 'right' ? 'right' : 'left';
        currentParentId = parentPlacement.parentId;
      } else {
        currentParentId = null;
      }
    }
  },

  // 8. Build recursive tree for a specific user (showing real downline only)
  buildBinaryTreeForUser(userId: string, maxDepth: number = 4): TreeNode {
    const placements = this.getAllPlacements();
    const user = userRegistryEngine.getUserById(userId);

    const rootPlacement = placements.find(p => p.userId === userId) || {
      id: `BIN-POS-${userId}`,
      userId: userId,
      userName: user?.name || 'Entrepreneur',
      userEmail: user?.email || '',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      parentId: null,
      position: 'root' as const,
      level: 0,
      bv: user?.binaryLeftVolume || 0,
      plan: user?.plan || 'growth',
      status: 'active' as const,
      sponsorId: user?.sponsorId || 'EVO-ID-000001',
      sponsorName: user?.sponsorName || 'System',
      createdAt: user?.createdAt || new Date().toISOString(),
    };

    const stats = this.getNetworkStatistics(userId);

    const buildSubtree = (parentId: string, currentDepth: number): TreeNode[] => {
      if (currentDepth >= maxDepth) return [];

      const childrenPlacements = placements.filter(p => p.parentId === parentId);
      const leftChild = childrenPlacements.find(p => p.position === 'left');
      const rightChild = childrenPlacements.find(p => p.position === 'right');

      const result: TreeNode[] = [];

      // Left branch
      if (leftChild) {
        const leftSubtree = buildSubtree(leftChild.userId, currentDepth + 1);
        const leftUser = userRegistryEngine.getUserById(leftChild.userId);
        result.push({
          id: leftChild.userId,
          name: leftChild.userName,
          avatar: leftChild.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: `${leftChild.plan.toUpperCase()} (${(leftUser?.binaryLeftVolume || 0) + (leftUser?.binaryRightVolume || 0) + leftChild.bv} BV)`,
          leg: 'left',
          status: leftChild.status,
          bv: (leftUser?.binaryLeftVolume || 0) + (leftUser?.binaryRightVolume || 0) + leftChild.bv,
          children: leftSubtree.length > 0 ? leftSubtree : undefined,
        });
      } else {
        // Vacant Left Slot
        result.push({
          id: `vacant_left_${parentId}`,
          name: '+ Open Left Slot',
          avatar: '',
          role: 'Available Position',
          leg: 'left',
          status: 'inactive',
          bv: 0,
        });
      }

      // Right branch
      if (rightChild) {
        const rightSubtree = buildSubtree(rightChild.userId, currentDepth + 1);
        const rightUser = userRegistryEngine.getUserById(rightChild.userId);
        result.push({
          id: rightChild.userId,
          name: rightChild.userName,
          avatar: rightChild.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          role: `${rightChild.plan.toUpperCase()} (${(rightUser?.binaryLeftVolume || 0) + (rightUser?.binaryRightVolume || 0) + rightChild.bv} BV)`,
          leg: 'right',
          status: rightChild.status,
          bv: (rightUser?.binaryLeftVolume || 0) + (rightUser?.binaryRightVolume || 0) + rightChild.bv,
          children: rightSubtree.length > 0 ? rightSubtree : undefined,
        });
      } else {
        // Vacant Right Slot
        result.push({
          id: `vacant_right_${parentId}`,
          name: '+ Open Right Slot',
          avatar: '',
          role: 'Available Position',
          leg: 'right',
          status: 'inactive',
          bv: 0,
        });
      }

      return result;
    };

    const treeChildren = buildSubtree(rootPlacement.userId, 1);

    return {
      id: rootPlacement.userId,
      name: rootPlacement.userName,
      avatar: rootPlacement.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: `You (${(user?.plan || 'growth').toUpperCase()})`,
      leg: 'root',
      status: 'active',
      bv: stats.leftBV + stats.rightBV,
      children: treeChildren,
    };
  },

  // 9. Calculate exact Left and Right BV and team counts
  getNetworkStatistics(userId: string): {
    leftCount: number;
    rightCount: number;
    totalMembers: number;
    leftBV: number;
    rightBV: number;
    weakerBV: number;
    carryForwardBV: number;
    estimatedPayout: number;
  } {
    const placements = this.getAllPlacements();
    const user = userRegistryEngine.getUserById(userId);

    const getDescendants = (parentId: string, leg: 'left' | 'right'): BinaryPlacementRecord[] => {
      const directChild = placements.find(p => p.parentId === parentId && p.position === leg);
      if (!directChild) return [];

      const list: BinaryPlacementRecord[] = [directChild];
      const queue: string[] = [directChild.userId];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const children = placements.filter(p => p.parentId === curr);
        for (const ch of children) {
          list.push(ch);
          queue.push(ch.userId);
        }
      }

      return list;
    };

    const leftDescendants = getDescendants(userId, 'left');
    const rightDescendants = getDescendants(userId, 'right');

    let leftBV = (user?.binaryLeftVolume || 0);
    let rightBV = (user?.binaryRightVolume || 0);

    // Sum personal BV of all descendants
    const sumLeftDescendants = leftDescendants.reduce((sum, d) => sum + (d.bv || 0), 0);
    const sumRightDescendants = rightDescendants.reduce((sum, d) => sum + (d.bv || 0), 0);

    leftBV = Math.max(leftBV, sumLeftDescendants);
    rightBV = Math.max(rightBV, sumRightDescendants);

    const weakerBV = Math.min(leftBV, rightBV);
    const carryForwardBV = Math.abs(leftBV - rightBV);
    const estimatedPayout = calculateBinaryCommission(weakerBV, 10);

    return {
      leftCount: leftDescendants.length,
      rightCount: rightDescendants.length,
      totalMembers: leftDescendants.length + rightDescendants.length,
      leftBV,
      rightBV,
      weakerBV,
      carryForwardBV,
      estimatedPayout,
    };
  }
};
