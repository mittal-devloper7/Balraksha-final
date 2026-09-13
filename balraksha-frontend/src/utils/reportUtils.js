export const extractReport=(payload)=>payload?.report||payload?.data?.report||payload?.data||payload||null;
export const extractReports=(payload)=>payload?.reports||payload?.data?.reports||payload?.data||[];
export const extractEvidence=(payload)=>payload?.evidence||payload?.data?.evidence||payload?.files||[];
export const extractRiskEvents=(payload)=>payload?.riskEvents||payload?.data?.riskEvents||payload?.events||[];

export const hasAssessment=(report)=>Number.isFinite(Number(report?.riskScore))&&report?.riskScore!==''&&Boolean(report?.riskLevel);
export const reportId=(report)=>report?.id??report?.reportId;
export const reportDate=(report)=>report?.createdAt||report?.created_at;
export const reportStatus=(report)=>report?.status||null;
export const reportEvidenceName=(item)=>item?.fileName||item?.filename||item?.name||'Evidence attachment';
export const reportEvidenceType=(item)=>item?.fileType||item?.mimeType||item?.type||'File reference';
