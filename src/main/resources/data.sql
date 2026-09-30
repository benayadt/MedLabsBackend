-- Insert test patients
INSERT INTO patients (id, first_name, last_name, date_of_birth, medical_record_number, gender, notes)
VALUES
    ('p1', 'James', 'Wilson', '1975-03-15', 'MRN-001234', 'M', 'No known allergies'),
    ('p2', 'Maria', 'Garcia', '1982-07-22', 'MRN-001235', 'F', 'History of hypertension'),
    ('p3', 'Robert', 'Brown', '1968-11-30', 'MRN-001236', 'M', 'Diabetic'),
    ('p4', 'Jennifer', 'Taylor', '1990-05-08', 'MRN-001237', 'F', 'No medical history noted')
ON CONFLICT (medical_record_number) DO NOTHING;
