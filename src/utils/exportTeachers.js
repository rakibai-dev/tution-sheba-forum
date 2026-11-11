/**
 * Escape CSV field text according to RFC 4180
 */
function escapeCSVField(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).trim();
  // If field contains comma, quote, or newline, escape quotes and wrap in quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return `"${str}"`;
}

/**
 * Export teacher records to CSV file and trigger browser download
 */
export function exportTeachersToCSV(teachers, filename = 'teachers.csv') {
  if (!teachers || teachers.length === 0) {
    alert('No teacher records to export.');
    return;
  }

  const headers = [
    'Name',
    'Gender',
    'Current Area',
    'Premium Code',
    'Uni Code',
    'Experience',
    'Favorite Subject',
    'Academic Year',
    'Honors Dept',
    'Honors University',
    'Masters Dept',
    'Masters University',
    'College',
    'HSC Group',
    'HSC Result',
    'School',
    'SSC Group',
    'SSC Result',
  ];

  const rows = teachers.map((t) => [
    escapeCSVField(t.name),
    escapeCSVField(t.gender),
    escapeCSVField(t.currentArea),
    escapeCSVField(t.premiumCode),
    escapeCSVField(t.uniCode),
    escapeCSVField(t.experience),
    escapeCSVField(t.favoriteSubject),
    escapeCSVField(t.academicYear),
    escapeCSVField(t.honorsDept),
    escapeCSVField(t.honorsUniversity),
    escapeCSVField(t.mastersDept),
    escapeCSVField(t.mastersUniversity),
    escapeCSVField(t.college),
    escapeCSVField(t.hscGroup),
    escapeCSVField(t.isResultShow ? t.hscResult : ''),
    escapeCSVField(t.school),
    escapeCSVField(t.sscGroup),
    escapeCSVField(t.isResultShow ? t.sscResult : ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export teacher records to formatted JSON file and trigger browser download
 */
export function exportTeachersToJSON(teachers, filename = 'teachers.json') {
  if (!teachers || teachers.length === 0) {
    alert('No teacher records to export.');
    return;
  }

  const jsonString = JSON.stringify(teachers, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

