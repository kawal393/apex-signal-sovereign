const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RegQuery {
  query: string;
  jurisdiction: string;
  country_code: string;
}

const SEARCH_QUERIES: RegQuery[] = [
  // === AUSTRALIA (20) ===
  { query: 'ASIC enforcement action penalty fine 2024 2025 2026', jurisdiction: 'ASIC', country_code: 'AU' },
  { query: 'ASIC corporate fraud prosecution penalty Australia', jurisdiction: 'ASIC', country_code: 'AU' },
  { query: 'APRA prudential enforcement action bank insurance 2024 2025', jurisdiction: 'APRA', country_code: 'AU' },
  { query: 'APRA superannuation enforcement penalty Australia', jurisdiction: 'APRA', country_code: 'AU' },
  { query: 'ACCC consumer protection enforcement action penalty 2024 2025', jurisdiction: 'ACCC', country_code: 'AU' },
  { query: 'ACCC cartel prosecution penalty fine Australia', jurisdiction: 'ACCC', country_code: 'AU' },
  { query: 'OAIC privacy enforcement action penalty Australia 2024 2025', jurisdiction: 'OAIC', country_code: 'AU' },
  { query: 'TGA medical device enforcement action recall Australia 2024 2025', jurisdiction: 'TGA', country_code: 'AU' },
  { query: 'AUSTRAC AML CTF enforcement penalty Australia 2024 2025', jurisdiction: 'AUSTRAC', country_code: 'AU' },
  { query: 'ATO compliance enforcement penalty Australia 2024 2025', jurisdiction: 'ATO', country_code: 'AU' },
  { query: 'Clean Energy Regulator enforcement Australia 2024 2025', jurisdiction: 'CER', country_code: 'AU' },
  { query: 'CASA aviation safety enforcement action Australia 2024 2025', jurisdiction: 'CASA', country_code: 'AU' },
  { query: 'NDIS Commission enforcement action banning order 2024 2025', jurisdiction: 'NDIS', country_code: 'AU' },
  { query: 'SafeWork Australia WHS prosecution penalty 2024 2025', jurisdiction: 'SafeWork', country_code: 'AU' },
  { query: 'ACMA telecommunications enforcement penalty Australia', jurisdiction: 'ACMA', country_code: 'AU' },
  { query: 'ASIC financial adviser ban enforcement 2024 2025', jurisdiction: 'ASIC', country_code: 'AU' },
  { query: 'Australia sanctions enforcement DFAT penalty 2024 2025', jurisdiction: 'DFAT', country_code: 'AU' },
  { query: 'FIRB foreign investment enforcement penalty Australia', jurisdiction: 'FIRB', country_code: 'AU' },
  { query: 'APVMA pesticide chemical enforcement Australia 2024', jurisdiction: 'APVMA', country_code: 'AU' },
  { query: 'Australian Competition Tribunal enforcement decision 2024', jurisdiction: 'ACT', country_code: 'AU' },

  // === UNITED STATES (30) ===
  { query: 'SEC enforcement action penalty fine 2024 2025 securities', jurisdiction: 'SEC', country_code: 'US' },
  { query: 'SEC litigation release fraud prosecution 2024 2025', jurisdiction: 'SEC', country_code: 'US' },
  { query: 'SEC cryptocurrency enforcement action penalty 2024 2025', jurisdiction: 'SEC', country_code: 'US' },
  { query: 'FTC enforcement action consumer protection penalty 2024 2025', jurisdiction: 'FTC', country_code: 'US' },
  { query: 'FTC antitrust enforcement action merger 2024 2025', jurisdiction: 'FTC', country_code: 'US' },
  { query: 'FDA warning letter enforcement action 2024 2025', jurisdiction: 'FDA', country_code: 'US' },
  { query: 'FDA drug recall enforcement pharmaceutical 2024 2025', jurisdiction: 'FDA', country_code: 'US' },
  { query: 'EPA environmental enforcement action penalty fine 2024 2025', jurisdiction: 'EPA', country_code: 'US' },
  { query: 'OSHA workplace safety enforcement penalty fine 2024 2025', jurisdiction: 'OSHA', country_code: 'US' },
  { query: 'CFPB consumer financial protection enforcement 2024 2025', jurisdiction: 'CFPB', country_code: 'US' },
  { query: 'DOJ antitrust enforcement prosecution penalty 2024 2025', jurisdiction: 'DOJ', country_code: 'US' },
  { query: 'DOJ corporate fraud prosecution penalty 2024 2025', jurisdiction: 'DOJ', country_code: 'US' },
  { query: 'CFTC enforcement action commodity futures penalty 2024 2025', jurisdiction: 'CFTC', country_code: 'US' },
  { query: 'FINRA enforcement action broker dealer penalty 2024 2025', jurisdiction: 'FINRA', country_code: 'US' },
  { query: 'OCC enforcement action bank penalty 2024 2025', jurisdiction: 'OCC', country_code: 'US' },
  { query: 'NHTSA vehicle safety recall enforcement 2024 2025', jurisdiction: 'NHTSA', country_code: 'US' },
  { query: 'FAA aviation safety enforcement action penalty 2024 2025', jurisdiction: 'FAA', country_code: 'US' },
  { query: 'New York Attorney General enforcement action penalty 2024 2025', jurisdiction: 'NY AG', country_code: 'US' },
  { query: 'California Attorney General enforcement CCPA privacy penalty 2024', jurisdiction: 'CA AG', country_code: 'US' },
  { query: 'Texas Attorney General enforcement action penalty 2024 2025', jurisdiction: 'TX AG', country_code: 'US' },
  { query: 'FinCEN AML enforcement action penalty bank 2024 2025', jurisdiction: 'FinCEN', country_code: 'US' },
  { query: 'OFAC sanctions enforcement action penalty 2024 2025', jurisdiction: 'OFAC', country_code: 'US' },
  { query: 'FCC telecommunications enforcement action penalty 2024 2025', jurisdiction: 'FCC', country_code: 'US' },
  { query: 'FERC energy enforcement action penalty 2024 2025', jurisdiction: 'FERC', country_code: 'US' },
  { query: 'HHS HIPAA enforcement action penalty healthcare 2024 2025', jurisdiction: 'HHS', country_code: 'US' },
  { query: 'CPSC consumer product safety recall enforcement 2024 2025', jurisdiction: 'CPSC', country_code: 'US' },
  { query: 'DOL labor enforcement action penalty wage 2024 2025', jurisdiction: 'DOL', country_code: 'US' },
  { query: 'NRC nuclear regulatory enforcement action penalty 2024', jurisdiction: 'NRC', country_code: 'US' },
  { query: 'SEC whistleblower award enforcement 2024 2025', jurisdiction: 'SEC', country_code: 'US' },
  { query: 'US Treasury sanctions enforcement crypto 2024 2025', jurisdiction: 'Treasury', country_code: 'US' },

  // === UNITED KINGDOM (15) ===
  { query: 'FCA enforcement action fine penalty 2024 2025', jurisdiction: 'FCA', country_code: 'UK' },
  { query: 'FCA consumer duty enforcement action penalty UK', jurisdiction: 'FCA', country_code: 'UK' },
  { query: 'FCA crypto enforcement action penalty UK 2024', jurisdiction: 'FCA', country_code: 'UK' },
  { query: 'ICO data protection enforcement notice fine 2024 2025', jurisdiction: 'ICO', country_code: 'UK' },
  { query: 'ICO GDPR UK enforcement action penalty fine', jurisdiction: 'ICO', country_code: 'UK' },
  { query: 'CMA competition enforcement action UK penalty 2024 2025', jurisdiction: 'CMA', country_code: 'UK' },
  { query: 'CMA merger enforcement digital markets UK 2024', jurisdiction: 'CMA', country_code: 'UK' },
  { query: 'Ofcom enforcement action penalty UK telecommunications 2024', jurisdiction: 'Ofcom', country_code: 'UK' },
  { query: 'HSE health safety enforcement prosecution penalty UK 2024', jurisdiction: 'HSE', country_code: 'UK' },
  { query: 'PRA prudential enforcement action penalty UK bank 2024', jurisdiction: 'PRA', country_code: 'UK' },
  { query: 'SFO serious fraud office prosecution UK 2024 2025', jurisdiction: 'SFO', country_code: 'UK' },
  { query: 'Ofgem energy enforcement action penalty UK 2024', jurisdiction: 'Ofgem', country_code: 'UK' },
  { query: 'UK sanctions enforcement OFSI penalty 2024 2025', jurisdiction: 'OFSI', country_code: 'UK' },
  { query: 'Environment Agency enforcement action penalty UK 2024', jurisdiction: 'EA', country_code: 'UK' },
  { query: 'FCA AML enforcement money laundering UK penalty 2024', jurisdiction: 'FCA', country_code: 'UK' },

  // === EUROPEAN UNION (20) ===
  { query: 'GDPR enforcement fine penalty 2024 2025 data protection', jurisdiction: 'GDPR', country_code: 'EU' },
  { query: 'GDPR enforcement fine million record penalty Europe', jurisdiction: 'GDPR', country_code: 'EU' },
  { query: 'EU AI Act implementation enforcement update 2024 2025', jurisdiction: 'AI Act', country_code: 'EU' },
  { query: 'EU AI Act compliance requirement penalty enforcement', jurisdiction: 'AI Act', country_code: 'EU' },
  { query: 'Digital Services Act enforcement action EU 2024 2025', jurisdiction: 'DSA', country_code: 'EU' },
  { query: 'Digital Markets Act enforcement gatekeeper EU 2024 2025', jurisdiction: 'DMA', country_code: 'EU' },
  { query: 'ESMA enforcement action securities EU penalty 2024', jurisdiction: 'ESMA', country_code: 'EU' },
  { query: 'EBA banking enforcement action EU penalty 2024', jurisdiction: 'EBA', country_code: 'EU' },
  { query: 'EIOPA insurance enforcement action EU 2024', jurisdiction: 'EIOPA', country_code: 'EU' },
  { query: 'European Commission antitrust enforcement fine 2024 2025', jurisdiction: 'EC Competition', country_code: 'EU' },
  { query: 'European Commission state aid enforcement decision 2024', jurisdiction: 'EC State Aid', country_code: 'EU' },
  { query: 'EU DORA digital operational resilience enforcement 2024 2025', jurisdiction: 'DORA', country_code: 'EU' },
  { query: 'Ireland DPC data protection enforcement fine GDPR 2024', jurisdiction: 'DPC Ireland', country_code: 'EU' },
  { query: 'France CNIL enforcement fine GDPR penalty 2024 2025', jurisdiction: 'CNIL', country_code: 'EU' },
  { query: 'Italy Garante enforcement fine GDPR penalty 2024', jurisdiction: 'Garante', country_code: 'EU' },
  { query: 'Spain AEPD enforcement fine GDPR penalty 2024', jurisdiction: 'AEPD', country_code: 'EU' },
  { query: 'Netherlands AP enforcement fine GDPR penalty 2024', jurisdiction: 'AP Netherlands', country_code: 'EU' },
  { query: 'EU MiCA crypto regulation enforcement 2024 2025', jurisdiction: 'MiCA', country_code: 'EU' },
  { query: 'EU carbon border adjustment mechanism enforcement 2024', jurisdiction: 'CBAM', country_code: 'EU' },
  { query: 'EU whistleblower directive enforcement 2024 2025', jurisdiction: 'Whistleblower', country_code: 'EU' },

  // === GERMANY (8) ===
  { query: 'BaFin enforcement action penalty fine Germany 2024 2025', jurisdiction: 'BaFin', country_code: 'DE' },
  { query: 'BaFin crypto enforcement Germany 2024', jurisdiction: 'BaFin', country_code: 'DE' },
  { query: 'Bundeskartellamt competition enforcement Germany penalty 2024', jurisdiction: 'Bundeskartellamt', country_code: 'DE' },
  { query: 'Bundeskartellamt digital platform enforcement Germany', jurisdiction: 'Bundeskartellamt', country_code: 'DE' },
  { query: 'BSI cybersecurity enforcement Germany 2024', jurisdiction: 'BSI', country_code: 'DE' },
  { query: 'Germany data protection enforcement fine 2024', jurisdiction: 'DPA Germany', country_code: 'DE' },
  { query: 'Germany AML enforcement penalty financial 2024', jurisdiction: 'AML Germany', country_code: 'DE' },
  { query: 'German Federal Financial Supervisory Authority enforcement 2024', jurisdiction: 'BaFin', country_code: 'DE' },

  // === FRANCE (6) ===
  { query: 'AMF enforcement action penalty France securities 2024 2025', jurisdiction: 'AMF', country_code: 'FR' },
  { query: 'CNIL enforcement fine penalty France data protection 2024', jurisdiction: 'CNIL', country_code: 'FR' },
  { query: 'Autorite de la concurrence enforcement France penalty 2024', jurisdiction: 'Competition FR', country_code: 'FR' },
  { query: 'ACPR banking enforcement France penalty 2024', jurisdiction: 'ACPR', country_code: 'FR' },
  { query: 'France antitrust enforcement fine tech company 2024', jurisdiction: 'Competition FR', country_code: 'FR' },
  { query: 'France AML enforcement penalty financial institution 2024', jurisdiction: 'AML France', country_code: 'FR' },

  // === JAPAN (10) ===
  { query: 'Japan FSA financial enforcement action penalty 2024 2025', jurisdiction: 'FSA', country_code: 'JP' },
  { query: 'Japan JFTC antitrust enforcement penalty 2024 2025', jurisdiction: 'JFTC', country_code: 'JP' },
  { query: 'Japan METI trade enforcement action penalty 2024', jurisdiction: 'METI', country_code: 'JP' },
  { query: 'Japan PMDA pharmaceutical enforcement recall 2024', jurisdiction: 'PMDA', country_code: 'JP' },
  { query: 'Japan Securities Exchange Surveillance enforcement 2024', jurisdiction: 'SESC', country_code: 'JP' },
  { query: 'Japan PPC personal information protection enforcement 2024', jurisdiction: 'PPC', country_code: 'JP' },
  { query: 'Japan crypto exchange enforcement FSA penalty 2024', jurisdiction: 'FSA', country_code: 'JP' },
  { query: 'Japan antitrust cartel enforcement penalty fine 2024', jurisdiction: 'JFTC', country_code: 'JP' },
  { query: 'Japan financial services enforcement penalty bank 2024', jurisdiction: 'FSA', country_code: 'JP' },
  { query: 'Japan consumer protection enforcement penalty 2024', jurisdiction: 'CAA', country_code: 'JP' },

  // === SINGAPORE (8) ===
  { query: 'MAS Singapore enforcement action penalty 2024 2025', jurisdiction: 'MAS', country_code: 'SG' },
  { query: 'MAS Singapore AML enforcement penalty financial 2024', jurisdiction: 'MAS', country_code: 'SG' },
  { query: 'PDPC Singapore data protection enforcement penalty 2024', jurisdiction: 'PDPC', country_code: 'SG' },
  { query: 'CSA Singapore cybersecurity enforcement 2024', jurisdiction: 'CSA', country_code: 'SG' },
  { query: 'IMDA Singapore telecommunications enforcement 2024', jurisdiction: 'IMDA', country_code: 'SG' },
  { query: 'Singapore competition enforcement CCCS penalty 2024', jurisdiction: 'CCCS', country_code: 'SG' },
  { query: 'MAS Singapore crypto enforcement digital payment token 2024', jurisdiction: 'MAS', country_code: 'SG' },
  { query: 'Singapore financial penalty enforcement action 2024 2025', jurisdiction: 'MAS', country_code: 'SG' },

  // === INDIA (12) ===
  { query: 'SEBI enforcement order penalty India securities 2024 2025', jurisdiction: 'SEBI', country_code: 'IN' },
  { query: 'SEBI insider trading enforcement penalty India 2024', jurisdiction: 'SEBI', country_code: 'IN' },
  { query: 'RBI regulatory enforcement action penalty India 2024 2025', jurisdiction: 'RBI', country_code: 'IN' },
  { query: 'RBI bank penalty enforcement India 2024', jurisdiction: 'RBI', country_code: 'IN' },
  { query: 'IRDAI insurance enforcement penalty India 2024', jurisdiction: 'IRDAI', country_code: 'IN' },
  { query: 'CCI competition enforcement penalty India 2024 2025', jurisdiction: 'CCI', country_code: 'IN' },
  { query: 'CCI antitrust enforcement penalty India tech company', jurisdiction: 'CCI', country_code: 'IN' },
  { query: 'TRAI telecom enforcement penalty India 2024', jurisdiction: 'TRAI', country_code: 'IN' },
  { query: 'India DPDP data protection enforcement penalty 2024', jurisdiction: 'DPDP', country_code: 'IN' },
  { query: 'India PMLA enforcement action money laundering 2024', jurisdiction: 'ED', country_code: 'IN' },
  { query: 'India GST enforcement action penalty evasion 2024', jurisdiction: 'GST', country_code: 'IN' },
  { query: 'India FEMA enforcement action penalty RBI 2024', jurisdiction: 'RBI', country_code: 'IN' },

  // === UAE / MIDDLE EAST (8) ===
  { query: 'DFSA enforcement action penalty Dubai financial 2024 2025', jurisdiction: 'DFSA', country_code: 'AE' },
  { query: 'VARA Dubai crypto enforcement penalty 2024 2025', jurisdiction: 'VARA', country_code: 'AE' },
  { query: 'SCA UAE securities enforcement penalty 2024', jurisdiction: 'SCA', country_code: 'AE' },
  { query: 'ADGM enforcement action penalty Abu Dhabi 2024', jurisdiction: 'ADGM', country_code: 'AE' },
  { query: 'UAE Central Bank enforcement penalty AML 2024', jurisdiction: 'CBUAE', country_code: 'AE' },
  { query: 'Saudi CMA enforcement action penalty securities 2024', jurisdiction: 'CMA', country_code: 'SA' },
  { query: 'Qatar Financial Centre enforcement action 2024', jurisdiction: 'QFCRA', country_code: 'QA' },
  { query: 'Bahrain CBB enforcement action penalty financial 2024', jurisdiction: 'CBB', country_code: 'BH' },

  // === SOUTH KOREA (8) ===
  { query: 'Korea FSC financial enforcement action penalty 2024 2025', jurisdiction: 'FSC', country_code: 'KR' },
  { query: 'Korea FSS financial supervisory enforcement penalty 2024', jurisdiction: 'FSS', country_code: 'KR' },
  { query: 'Korea KFTC antitrust enforcement penalty 2024 2025', jurisdiction: 'KFTC', country_code: 'KR' },
  { query: 'Korea KFTC tech company enforcement penalty', jurisdiction: 'KFTC', country_code: 'KR' },
  { query: 'Korea PIPC data protection enforcement penalty 2024', jurisdiction: 'PIPC', country_code: 'KR' },
  { query: 'Korea crypto enforcement penalty exchange 2024', jurisdiction: 'FSC', country_code: 'KR' },
  { query: 'Korea Fair Trade Commission enforcement fine 2024', jurisdiction: 'KFTC', country_code: 'KR' },
  { query: 'Korea financial penalty enforcement bank insurance 2024', jurisdiction: 'FSS', country_code: 'KR' },

  // === BRAZIL (8) ===
  { query: 'Brazil CVM securities enforcement penalty 2024 2025', jurisdiction: 'CVM', country_code: 'BR' },
  { query: 'Brazil ANPD LGPD enforcement penalty data protection 2024', jurisdiction: 'ANPD', country_code: 'BR' },
  { query: 'Brazil CADE antitrust enforcement penalty 2024 2025', jurisdiction: 'CADE', country_code: 'BR' },
  { query: 'Brazil BCB central bank enforcement penalty 2024', jurisdiction: 'BCB', country_code: 'BR' },
  { query: 'Brazil SUSEP insurance enforcement penalty 2024', jurisdiction: 'SUSEP', country_code: 'BR' },
  { query: 'Brazil environmental enforcement IBAMA penalty 2024', jurisdiction: 'IBAMA', country_code: 'BR' },
  { query: 'Brazil AML enforcement penalty financial institution 2024', jurisdiction: 'COAF', country_code: 'BR' },
  { query: 'Brazil consumer protection enforcement SENACON 2024', jurisdiction: 'SENACON', country_code: 'BR' },

  // === CANADA (10) ===
  { query: 'Canada CSA securities enforcement penalty 2024 2025', jurisdiction: 'CSA', country_code: 'CA' },
  { query: 'Canada OSC enforcement action penalty Ontario securities 2024', jurisdiction: 'OSC', country_code: 'CA' },
  { query: 'OSFI Canada enforcement action penalty bank 2024', jurisdiction: 'OSFI', country_code: 'CA' },
  { query: 'Canada Privacy Commissioner enforcement penalty 2024', jurisdiction: 'OPC', country_code: 'CA' },
  { query: 'Canada Competition Bureau enforcement penalty 2024 2025', jurisdiction: 'Competition Bureau', country_code: 'CA' },
  { query: 'FINTRAC Canada AML enforcement penalty 2024', jurisdiction: 'FINTRAC', country_code: 'CA' },
  { query: 'Canada BCSC securities enforcement penalty 2024', jurisdiction: 'BCSC', country_code: 'CA' },
  { query: 'Canada AMF Quebec securities enforcement 2024', jurisdiction: 'AMF QC', country_code: 'CA' },
  { query: 'Canada environmental enforcement penalty pollution 2024', jurisdiction: 'ECCC', country_code: 'CA' },
  { query: 'Canada CRTC telecommunications enforcement penalty 2024', jurisdiction: 'CRTC', country_code: 'CA' },

  // === SOUTH AFRICA (6) ===
  { query: 'South Africa FSCA enforcement action penalty 2024 2025', jurisdiction: 'FSCA', country_code: 'ZA' },
  { query: 'South Africa NCR consumer enforcement penalty 2024', jurisdiction: 'NCR', country_code: 'ZA' },
  { query: 'South Africa Information Regulator enforcement POPIA 2024', jurisdiction: 'InfoReg', country_code: 'ZA' },
  { query: 'South Africa competition enforcement penalty 2024', jurisdiction: 'CompCom', country_code: 'ZA' },
  { query: 'South Africa SARB enforcement penalty bank 2024', jurisdiction: 'SARB', country_code: 'ZA' },
  { query: 'South Africa FIC AML enforcement penalty 2024', jurisdiction: 'FIC', country_code: 'ZA' },

  // === MEXICO (6) ===
  { query: 'Mexico CNBV securities enforcement penalty 2024 2025', jurisdiction: 'CNBV', country_code: 'MX' },
  { query: 'Mexico Cofece antitrust enforcement penalty 2024', jurisdiction: 'Cofece', country_code: 'MX' },
  { query: 'Mexico INAI data protection enforcement penalty 2024', jurisdiction: 'INAI', country_code: 'MX' },
  { query: 'Mexico Banxico enforcement penalty financial 2024', jurisdiction: 'Banxico', country_code: 'MX' },
  { query: 'Mexico CNBV AML enforcement penalty bank 2024', jurisdiction: 'CNBV', country_code: 'MX' },
  { query: 'Mexico Cofepris pharmaceutical enforcement penalty 2024', jurisdiction: 'Cofepris', country_code: 'MX' },

  // === NEW ZEALAND (6) ===
  { query: 'New Zealand FMA enforcement action penalty 2024 2025', jurisdiction: 'FMA', country_code: 'NZ' },
  { query: 'New Zealand Commerce Commission enforcement penalty 2024', jurisdiction: 'ComCom', country_code: 'NZ' },
  { query: 'New Zealand Privacy Commissioner enforcement penalty 2024', jurisdiction: 'OPC NZ', country_code: 'NZ' },
  { query: 'New Zealand WorkSafe enforcement prosecution penalty 2024', jurisdiction: 'WorkSafe NZ', country_code: 'NZ' },
  { query: 'New Zealand FMA AML enforcement penalty 2024', jurisdiction: 'FMA', country_code: 'NZ' },
  { query: 'New Zealand environmental enforcement penalty 2024', jurisdiction: 'MfE', country_code: 'NZ' },

  // === HONG KONG (6) ===
  { query: 'Hong Kong SFC enforcement action penalty 2024 2025', jurisdiction: 'SFC', country_code: 'HK' },
  { query: 'Hong Kong HKMA enforcement action penalty bank 2024', jurisdiction: 'HKMA', country_code: 'HK' },
  { query: 'Hong Kong PCPD data privacy enforcement penalty 2024', jurisdiction: 'PCPD', country_code: 'HK' },
  { query: 'Hong Kong SFC crypto enforcement penalty 2024', jurisdiction: 'SFC', country_code: 'HK' },
  { query: 'Hong Kong competition enforcement penalty 2024', jurisdiction: 'CompComm', country_code: 'HK' },
  { query: 'Hong Kong insurance enforcement penalty IA 2024', jurisdiction: 'IA', country_code: 'HK' },

  // === SWITZERLAND (5) ===
  { query: 'FINMA enforcement action penalty Switzerland 2024 2025', jurisdiction: 'FINMA', country_code: 'CH' },
  { query: 'FINMA crypto enforcement penalty Switzerland 2024', jurisdiction: 'FINMA', country_code: 'CH' },
  { query: 'FDPIC data protection enforcement Switzerland 2024', jurisdiction: 'FDPIC', country_code: 'CH' },
  { query: 'Switzerland AML enforcement penalty financial 2024', jurisdiction: 'AML CH', country_code: 'CH' },
  { query: 'COMCO Swiss competition enforcement penalty 2024', jurisdiction: 'COMCO', country_code: 'CH' },

  // === OTHER REGIONS (20) ===
  { query: 'Nigeria SEC enforcement action penalty securities 2024', jurisdiction: 'SEC', country_code: 'NG' },
  { query: 'Kenya CMA enforcement action penalty securities 2024', jurisdiction: 'CMA', country_code: 'KE' },
  { query: 'Israel ISA securities enforcement penalty 2024', jurisdiction: 'ISA', country_code: 'IL' },
  { query: 'Turkey CMB enforcement action penalty securities 2024', jurisdiction: 'CMB', country_code: 'TR' },
  { query: 'Thailand SEC enforcement action penalty securities 2024', jurisdiction: 'SEC', country_code: 'TH' },
  { query: 'Vietnam SSC enforcement action penalty securities 2024', jurisdiction: 'SSC', country_code: 'VN' },
  { query: 'Indonesia OJK enforcement action penalty financial 2024', jurisdiction: 'OJK', country_code: 'ID' },
  { query: 'Malaysia SC enforcement action penalty securities 2024', jurisdiction: 'SC', country_code: 'MY' },
  { query: 'Philippines SEC enforcement action penalty 2024', jurisdiction: 'SEC', country_code: 'PH' },
  { query: 'Taiwan FSC enforcement action penalty financial 2024', jurisdiction: 'FSC', country_code: 'TW' },
  { query: 'Poland UODO enforcement fine GDPR penalty 2024', jurisdiction: 'UODO', country_code: 'PL' },
  { query: 'Sweden IMY enforcement fine GDPR penalty 2024', jurisdiction: 'IMY', country_code: 'SE' },
  { query: 'Norway Datatilsynet enforcement fine GDPR 2024', jurisdiction: 'Datatilsynet', country_code: 'NO' },
  { query: 'Austria DSB enforcement fine GDPR penalty 2024', jurisdiction: 'DSB', country_code: 'AT' },
  { query: 'Belgium APD enforcement fine GDPR penalty 2024', jurisdiction: 'APD', country_code: 'BE' },
  { query: 'Portugal CNPD enforcement fine GDPR 2024', jurisdiction: 'CNPD', country_code: 'PT' },
  { query: 'Greece HDPA enforcement fine GDPR 2024', jurisdiction: 'HDPA', country_code: 'GR' },
  { query: 'Colombia SFC enforcement penalty financial 2024', jurisdiction: 'SFC', country_code: 'CO' },
  { query: 'Chile CMF enforcement penalty financial 2024', jurisdiction: 'CMF', country_code: 'CL' },
  { query: 'Peru SMV enforcement penalty securities 2024', jurisdiction: 'SMV', country_code: 'PE' },
];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const FIRECRAWL_API_KEY = Deno.env.get('FIRECRAWL_API_KEY');
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!FIRECRAWL_API_KEY) {
      return new Response(JSON.stringify({ error: 'Firecrawl not configured' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Batch support
    const url = new URL(req.url);
    const batch = parseInt(url.searchParams.get('batch') || '0');
    const batchSize = 5;
    const startIdx = batch * batchSize;
    const queries = SEARCH_QUERIES.slice(startIdx, startIdx + batchSize);

    if (queries.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No more batches', total_queries: SEARCH_QUERIES.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let totalInserted = 0;
    const errors: string[] = [];

    for (const sq of queries) {
      try {
        console.log(`Searching: ${sq.query}`);

        const searchRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${FIRECRAWL_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: sq.query, limit: 8, scrapeOptions: { formats: ['markdown'] } }),
        });
        const searchData = await searchRes.json();

        if (!searchData.success || !searchData.data?.length) {
          console.log(`No results for: ${sq.query}`);
          continue;
        }

        const combinedContent = searchData.data
          .map((r: any) => `SOURCE: ${r.url}\nTITLE: ${r.title}\n${r.markdown || r.description || ''}`)
          .join('\n\n---\n\n')
          .slice(0, 10000);

        console.log(`Got ${searchData.data.length} results, extracting...`);

        const aiRes = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              {
                role: 'system',
                content: `You extract REAL regulatory enforcement actions from news and government sources. Return a JSON array of up to 10 records. Each record:
- "title": concise title of the enforcement action (max 100 chars)
- "summary": 2-3 sentence summary of the action, including who was penalized and why
- "severity": "critical" for major fines/$1M+/criminal, "moderate" for significant actions, "informational" for updates/guidance
- "source_url": URL where this was found
- "source_domain": domain name of the source

CRITICAL: Only extract REAL enforcement actions from the provided content. Do not invent records. Return [] if none found.`
              },
              {
                role: 'user',
                content: `Extract regulatory enforcement actions related to ${sq.jurisdiction} (${sq.country_code}) from:\n\n${combinedContent}`
              },
            ],
            max_tokens: 4000,
          }),
        });

        if (!aiRes.ok) {
          errors.push(`AI failed: ${sq.query} (${aiRes.status})`);
          continue;
        }

        const aiData = await aiRes.json();
        const rawContent = aiData.choices?.[0]?.message?.content || '[]';

        let records: any[] = [];
        try {
          const jsonStr = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          records = JSON.parse(jsonStr);
          if (!Array.isArray(records)) records = [];
        } catch {
          errors.push(`Parse failed: ${sq.query}`);
          continue;
        }

        console.log(`Extracted ${records.length} records for ${sq.jurisdiction} (${sq.country_code})`);

        for (const record of records) {
          if (!record.title || record.title.length < 10) continue;

          const encoder = new TextEncoder();
          const hashInput = `${record.title}|${sq.jurisdiction}|${sq.country_code}|${record.source_url || ''}`;
          const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(hashInput));
          const contentHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');

          let sourceDomain = sq.jurisdiction;
          try { if (record.source_url) sourceDomain = new URL(record.source_url).hostname; } catch {}

          const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/regulatory_updates`, {
            method: 'POST',
            headers: {
              'apikey': SUPABASE_SERVICE_ROLE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              country_code: sq.country_code,
              jurisdiction: sq.jurisdiction,
              title: record.title.slice(0, 200),
              summary: record.summary || record.title,
              source_url: record.source_url || `https://${sourceDomain}`,
              source_domain: record.source_domain || sourceDomain,
              content_hash: contentHash,
              severity: ['critical', 'moderate', 'informational'].includes(record.severity) ? record.severity : 'informational',
            }),
          });

          if (insertRes.ok || insertRes.status === 201) {
            totalInserted++;
          } else if (insertRes.status === 409) {
            console.log(`Duplicate: ${record.title?.slice(0, 40)}`);
          } else {
            const errText = await insertRes.text();
            console.error(`Insert failed: ${insertRes.status} ${errText}`);
          }
        }
      } catch (err) {
        console.error(`Error: ${sq.query}:`, err);
        errors.push(`${sq.query}: ${err instanceof Error ? err.message : 'unknown'}`);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      inserted: totalInserted,
      batch,
      queries_in_batch: queries.length,
      total_queries: SEARCH_QUERIES.length,
      total_batches: Math.ceil(SEARCH_QUERIES.length / batchSize),
      errors: errors.length > 0 ? errors : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Regulatory monitor error:', error);
    return new Response(JSON.stringify({ error: 'Monitor failed' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
