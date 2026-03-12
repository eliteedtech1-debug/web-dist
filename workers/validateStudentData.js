/**
 * Web Worker for Student Data Validation
 * Offloads heavy validation logic from main thread to prevent UI freezing
 *
 * Usage: Post message with { data, requiredColumns, validationRules }
 * Returns: { errors, validRows, totalRows, stats }
 */

self.addEventListener('message', (event) => {
  const { data, requiredColumns = [], validationRules = {} } = event.data;

  const errors = [];
  const validRows = [];
  const duplicates = {
    admission_no: new Set(),
    email: new Set(),
    phone: new Set(),
  };

  // Helper function to check if value is empty
  const isEmpty = (value) => {
    return value === null || value === undefined || String(value).trim() === '';
  };

  // Validation regex patterns
  const patterns = {
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    phone: /^[\d\s\-+()]{7,15}$/,
    admission_no: /^[A-Z0-9-]+$/i,
    name: /^[a-zA-Z\s'-]+$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
  };

  // Track duplicates within the dataset
  const admissionNumbers = new Map();
  const emails = new Map();

  data.forEach((row, index) => {
    const rowNumber = index + 1;
    const rowErrors = [];

    // 1. Check required fields
    requiredColumns.forEach(col => {
      if (isEmpty(row[col])) {
        rowErrors.push(`${col} is required`);
      }
    });

    // 2. Validate admission number
    if (!isEmpty(row.admission_no)) {
      const admNo = String(row.admission_no).trim();

      if (!patterns.admission_no.test(admNo)) {
        rowErrors.push('Admission number must contain only letters, numbers, and hyphens');
      }

      // Check for duplicates within dataset
      if (admissionNumbers.has(admNo)) {
        rowErrors.push(`Duplicate admission number found at row ${admissionNumbers.get(admNo)}`);
        duplicates.admission_no.add(admNo);
      } else {
        admissionNumbers.set(admNo, rowNumber);
      }

      if (admNo.length < 3 || admNo.length > 20) {
        rowErrors.push('Admission number must be between 3 and 20 characters');
      }
    }

    // 3. Validate student name
    if (!isEmpty(row.student_name)) {
      const name = String(row.student_name).trim();

      if (!patterns.name.test(name)) {
        rowErrors.push('Student name must contain only letters, spaces, hyphens, and apostrophes');
      }

      if (name.length < 2 || name.length > 100) {
        rowErrors.push('Student name must be between 2 and 100 characters');
      }
    }

    // 4. Validate email
    if (!isEmpty(row.email)) {
      const email = String(row.email).trim().toLowerCase();

      if (!patterns.email.test(email)) {
        rowErrors.push('Invalid email format');
      }

      // Check for duplicates within dataset
      if (emails.has(email)) {
        rowErrors.push(`Duplicate email found at row ${emails.get(email)}`);
        duplicates.email.add(email);
      } else {
        emails.set(email, rowNumber);
      }
    }

    // 5. Validate phone number
    if (!isEmpty(row.phone)) {
      const phone = String(row.phone).trim();

      if (!patterns.phone.test(phone)) {
        rowErrors.push('Invalid phone number format');
      }
    }

    // 6. Validate date of birth
    if (!isEmpty(row.date_of_birth)) {
      const dob = String(row.date_of_birth).trim();

      if (!patterns.date.test(dob)) {
        rowErrors.push('Date of birth must be in YYYY-MM-DD format');
      } else {
        const dobDate = new Date(dob);
        const today = new Date();
        const age = today.getFullYear() - dobDate.getFullYear();

        if (age < 3 || age > 100) {
          rowErrors.push('Student age must be between 3 and 100 years');
        }
      }
    }

    // 7. Validate gender
    if (!isEmpty(row.sex)) {
      const gender = String(row.sex).trim().toUpperCase();
      const validGenders = ['M', 'F', 'MALE', 'FEMALE', 'OTHER'];

      if (!validGenders.includes(gender)) {
        rowErrors.push('Gender must be M, F, Male, Female, or Other');
      }
    }

    // 8. Validate class_code
    if (!isEmpty(row.class_code)) {
      const classCode = String(row.class_code).trim();

      if (classCode.length < 2 || classCode.length > 10) {
        rowErrors.push('Class code must be between 2 and 10 characters');
      }
    }

    // 9. Validate section_code
    if (!isEmpty(row.section_code)) {
      const sectionCode = String(row.section_code).trim();

      if (sectionCode.length < 1 || sectionCode.length > 5) {
        rowErrors.push('Section code must be between 1 and 5 characters');
      }
    }

    // 10. Validate status
    if (!isEmpty(row.status)) {
      const status = String(row.status).trim();
      const validStatuses = [
        'Active', 'Inactive', 'Suspended', 'Withdrawn',
        'Transferred', 'Graduated', 'Expelled', 'Fresh Student', 'Returning Student'
      ];

      if (!validStatuses.includes(status)) {
        rowErrors.push(`Status must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // 11. Validate guardian information
    if (!isEmpty(row.guardian_phone)) {
      const guardianPhone = String(row.guardian_phone).trim();

      if (!patterns.phone.test(guardianPhone)) {
        rowErrors.push('Invalid guardian phone number format');
      }
    }

    if (!isEmpty(row.guardian_email)) {
      const guardianEmail = String(row.guardian_email).trim().toLowerCase();

      if (!patterns.email.test(guardianEmail)) {
        rowErrors.push('Invalid guardian email format');
      }
    }

    // 12. Custom validation rules (if provided)
    if (validationRules.customValidations) {
      validationRules.customValidations.forEach(validation => {
        const { field, rule, message } = validation;
        const value = row[field];

        if (!isEmpty(value) && !rule(value)) {
          rowErrors.push(message);
        }
      });
    }

    // Collect results
    if (rowErrors.length > 0) {
      errors.push({
        row: rowNumber,
        admission_no: row.admission_no || 'N/A',
        student_name: row.student_name || 'N/A',
        errors: rowErrors,
      });
    } else {
      // Clean and normalize the row data
      validRows.push({
        ...row,
        admission_no: isEmpty(row.admission_no) ? '' : String(row.admission_no).trim().toUpperCase(),
        student_name: isEmpty(row.student_name) ? '' : String(row.student_name).trim(),
        email: isEmpty(row.email) ? '' : String(row.email).trim().toLowerCase(),
        phone: isEmpty(row.phone) ? '' : String(row.phone).trim(),
        sex: isEmpty(row.sex) ? '' : String(row.sex).trim().toUpperCase(),
        status: isEmpty(row.status) ? 'Active' : String(row.status).trim(),
      });
    }

    // Report progress every 100 rows
    if (rowNumber % 100 === 0) {
      self.postMessage({
        type: 'progress',
        processed: rowNumber,
        total: data.length,
        percentage: Math.round((rowNumber / data.length) * 100),
      });
    }
  });

  // Calculate statistics
  const stats = {
    total: data.length,
    valid: validRows.length,
    invalid: errors.length,
    duplicates: {
      admission_no: duplicates.admission_no.size,
      email: duplicates.email.size,
      phone: duplicates.phone.size,
    },
  };

  // Send final results
  self.postMessage({
    type: 'complete',
    errors,
    validRows,
    totalRows: data.length,
    stats,
  });
});

// Handle errors
self.addEventListener('error', (event) => {
  self.postMessage({
    type: 'error',
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
  });
});
