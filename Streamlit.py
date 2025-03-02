import streamlit as st


# Create a simple login form
st.title('Login')

# Get user input for username and password
username = st.text_input('Username')
password = st.text_input('Password', type='password')

st.button('Login')


# Simulate a login process (replace this with actual authentication logic)
if username == 'patient' and password == 'password':
    st.success('Login successful!')
    # Proceed to patient data input screen
else:
    st.error('Invalid username or password.')


# Display health data input form
st.title('Patient Health Data')

# Blood pressure input (systolic and diastolic)
blood_pressure_systolic = st.number_input('Systolic Blood Pressure', min_value=50, max_value=200, value=120)
blood_pressure_diastolic = st.number_input('Diastolic Blood Pressure', min_value=30, max_value=120, value=80)

# Blood oxygen level
blood_oxygen = st.number_input('Blood Oxygen Level (%)', min_value=50, max_value=100, value=98)

# Additional health data fields can be added similarly
weight = st.number_input('Weight (kg)', min_value=30, max_value=300, value=70)

# Submit button to log the data
if st.button('Submit Data'):
    st.write('Data submitted successfully!')
    # You can later save this data to a database or use it for analysis


# Display patient data for doctor (you can fetch from a database)
st.title('Patient Health Data for Doctor')

# Sample data (this would be fetched from your database in a real app)
patient_data = {
    'Blood Pressure': '120/80 mmHg',
    'Blood Oxygen': '98%',
    'Weight': '70 kg',
}




for key, value in patient_data.items():
    st.write(f"{key}: {value}")
