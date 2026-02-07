// APEX Node Registry - Sovereign Signal Infrastructure

export interface ApexNode {
  id: string;
  name: string;
  status: 'live' | 'sealed';
  purpose: string;
  externalUrl?: string;
  description?: string;
  whatYouGet?: string[];
  whoItsFor?: string[];
}

export const APEX_NODES: ApexNode[] = [
  // LIVE NODES
  {
    id: 'ndis-watchtower',
    name: 'APEX NDIS Watchtower',
    status: 'live',
    purpose: 'Real-time provider compliance and pricing signal monitoring for NDIS operators.',
    externalUrl: 'https://kawal393.github.io/ndis-signal-board/',
    whatYouGet: [
      'Provider registration and compliance status signals',
      'Pricing band alerts and market positioning data',
      'Operational risk assessment against current regulatory state',
    ],
    whoItsFor: [
      'NDIS providers navigating compliance uncertainty',
      'Operators considering market entry or expansion',
      'Decision-makers facing regulatory pressure',
    ],
  },
  {
    id: 'corporate-translator',
    name: 'APEX Corporate Translator',
    status: 'live',
    purpose: 'Decode institutional language into operational reality.',
    externalUrl: 'https://kawal393.github.io/apex-corporate-translator/',
    whatYouGet: [
      'Plain-language translation of corporate announcements',
      'Hidden signal extraction from public filings',
      'Institutional intent mapping and dependency analysis',
    ],
    whoItsFor: [
      'Operators dealing with institutional counterparties',
      'Stakeholders requiring clarity on corporate positioning',
      'Decision-makers evaluating partnership or exit timing',
    ],
  },
  {
    id: 'ata-ledger',
    name: 'APEX-ATA Ledger',
    status: 'live',
    purpose: 'Permanent record of signal events and system state changes.',
    externalUrl: 'https://kawal393.github.io/ompc-1/',
    whatYouGet: [
      'Immutable event timeline with timestamp verification',
      'Cross-referenced signal correlation mapping',
      'Historical pattern recognition for decision support',
    ],
    whoItsFor: [
      'Operators requiring auditable decision records',
      'Stakeholders building institutional memory',
      'Analysts tracking signal evolution over time',
    ],
  },
  {
    id: 'ghost-protocol',
    name: 'APEX Ghost Protocol',
    status: 'live',
    purpose: 'Silent monitoring of entities and dependencies without direct engagement.',
    externalUrl: 'https://kawal393.github.io/-APEX-GHOST-PROTOCOL/',
    whatYouGet: [
      'Passive entity monitoring and change detection',
      'Dependency mapping without exposure',
      'Early warning signals on counterparty risk',
    ],
    whoItsFor: [
      'Operators monitoring competitors or counterparties',
      'Stakeholders tracking regulatory body movements',
      'Decision-makers requiring situational awareness',
    ],
  },
  
  // SEALED NODES
  {
    id: 'grid-constraint',
    name: 'Grid Constraint + Large Load Watchtower',
    status: 'sealed',
    purpose: 'Infrastructure capacity monitoring and constraint signal detection for energy-intensive operators.',
    description: 'Monitors grid stability, large load connection queues, and infrastructure bottleneck signals. Reserved for operators with significant energy exposure.',
  },
  {
    id: 'pharma-zombie',
    name: 'Pharma Zombie Detector',
    status: 'sealed',
    purpose: 'Identification of pharmaceutical entities exhibiting terminal operational patterns.',
    description: 'Pattern recognition for companies displaying late-stage decline signals despite continued market presence. Reserved for institutional operators.',
  },
  {
    id: 'optionality-vault',
    name: 'Optionality Vault',
    status: 'sealed',
    purpose: 'Strategic option preservation and decision pathway mapping.',
    description: 'Framework for maintaining decision optionality under institutional pressure. Reserved for operators facing irreversible choice architecture.',
  },
];

export const getLiveNodes = () => APEX_NODES.filter(n => n.status === 'live');
export const getSealedNodes = () => APEX_NODES.filter(n => n.status === 'sealed');
export const getNodeById = (id: string) => APEX_NODES.find(n => n.id === id);
