/**
 * Frontend anonymization layer — redacts any real names that slip through scrapers.
 * All entity/person names are replaced with sector-coded identifiers.
 */

const stateMap: Record<string, string> = {
  NSW: 'NS', VIC: 'VI', QLD: 'QL', WA: 'WA', SA: 'SA', TAS: 'TA', NT: 'NT', ACT: 'AC', National: 'AU',
  Federal: 'FD',
};

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Anonymize an NDIS entity name → "Provider-NSW-0142" */
export function anonymizeNDISEntity(name: string, state?: string): string {
  if (!name) return 'Provider-AU-0000';
  const code = stateMap[state || ''] || 'AU';
  const num = (hashCode(name) % 9000 + 1000).toString();
  return `Provider-${code}-${num}`;
}

/** Anonymize a mining company → "Mining Entity A-1234" */
export function anonymizeMiningCompany(company: string): string {
  if (!company) return 'Mining Entity-0000';
  const num = (hashCode(company) % 9000 + 1000).toString();
  return `Mining Entity-${num}`;
}

/** Anonymize a mine name → "Site-WA-5678" */
export function anonymizeMineSite(mine: string, state?: string): string {
  if (!mine || mine === 'N/A' || mine === 'Not specified') return 'Undisclosed Site';
  const code = stateMap[state || ''] || 'AU';
  const num = (hashCode(mine) % 9000 + 1000).toString();
  return `Site-${code}-${num}`;
}

/** Anonymize a court case name → "Case Ref FD-2024-1234" */
export function anonymizeCaseName(caseName: string, jurisdiction?: string): string {
  if (!caseName) return 'Case Ref-0000';
  const code = stateMap[jurisdiction || ''] || 'AU';
  const yearMatch = caseName.match(/\b(20\d{2})\b/);
  const year = yearMatch ? yearMatch[1] : '2024';
  const num = (hashCode(caseName) % 9000 + 1000).toString();
  return `Case Ref ${code}-${year}-${num}`;
}

/** Anonymize a company name → "Entity-ASIC-1234" */
export function anonymizeCompany(company: string, regulator?: string): string {
  if (!company) return 'Entity-0000';
  const reg = regulator || 'REG';
  const num = (hashCode(company) % 9000 + 1000).toString();
  return `Entity-${reg}-${num}`;
}

/** Anonymize a director name → "Director-1234" */
export function anonymizeDirector(name: string | null): string | null {
  if (!name) return null;
  const num = (hashCode(name) % 9000 + 1000).toString();
  return `Director-${num}`;
}

/** Anonymize a sanctions entity → "Designated Entity-OFAC-1234" */
export function anonymizeSanctionsEntity(entity: string, listSource?: string): string {
  if (!entity) return 'Designated Entity-0000';
  const src = (listSource || 'LIST').replace(/\s+/g, '-').slice(0, 8);
  const num = (hashCode(entity) % 9000 + 1000).toString();
  return `Designated Entity-${src}-${num}`;
}

/** Anonymize an ASX company → "ASX Entity-1234" */
export function anonymizeASXCompany(company: string, code?: string): string {
  if (!company) return 'ASX Entity-0000';
  const num = (hashCode(company) % 9000 + 1000).toString();
  return `ASX Entity-${num}`;
}

/** Anonymize ASX ticker code → "XX1" */
export function anonymizeASXCode(code: string): string {
  if (!code) return 'XXX';
  const num = (hashCode(code) % 900 + 100).toString();
  return `E${num}`;
}

/** Strip any personal names from a description string */
export function sanitizeDescription(desc: string): string {
  if (!desc) return '';
  // Remove patterns like "Mr/Mrs/Ms/Dr FirstName LastName"
  return desc
    .replace(/\b(Mr|Mrs|Ms|Miss|Dr|Prof|Justice|Hon)\.?\s+[A-Z][a-z]+(\s+[A-Z][a-z]+){0,2}/g, '[Name Redacted]')
    .replace(/\b(Director|CEO|CFO|Manager|Owner)\s+[A-Z][a-z]+(\s+[A-Z][a-z]+){0,2}/g, '$1 [Name Redacted]');
}
