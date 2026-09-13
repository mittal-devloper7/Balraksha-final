export const getRiskLevel=(score)=>{const n=Number(score)||0;if(n>=90)return 'CRITICAL';if(n>=70)return 'HIGH';if(n>=40)return 'MEDIUM';return 'LOW';};
export const getRiskDescription=(level)=>({LOW:'No immediate safety concern indicated.',MEDIUM:'Some safety signals were detected. Consider reviewing the interaction.',HIGH:'Potentially unsafe interaction detected. Consider reporting or getting help.',CRITICAL:'Immediate attention may be appropriate. Consider reporting and getting trusted support.'}[level]||'');
export const riskTone=(level)=>({LOW:'low',MEDIUM:'medium',HIGH:'high',CRITICAL:'critical'}[level]||'low');
export const pretty=(value='')=>String(value).replaceAll('_',' ').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
