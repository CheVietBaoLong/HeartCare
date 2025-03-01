import React, { useState } from 'react';
import { Search, User, Users, Calendar, FileText, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample data
const patientList = [
  { id: 1, name: 'John Smith', age: 58, condition: 'Hypertension', lastVisit: '2025-02-15', risk: 'medium' },
  { id: 2, name: 'Mary Johnson', age: 62, condition: 'Coronary Artery Disease', lastVisit: '2025-02-20', risk: 'high' },
  { id: 3, name: 'Robert Davis', age: 45, condition: 'Arrhythmia', lastVisit: '2025-02-25', risk: 'low' },
  { id: 4, name: 'Patricia Wilson', age: 70, condition: 'Heart Failure', lastVisit: '2025-02-10', risk: 'high' },
  { id: 5, name: 'James Brown', age: 53, condition: 'Valve Disease', lastVisit: '2025-02-05', risk: 'medium' }
];

const patientVitalsHistory = [
  { date: '2025-01-15', heartRate: 75, systolic: 145, diastolic: 95 },
  { date: '2025-01-22', heartRate: 72, systolic: 140, diastolic: 92 },
  { date: '2025-01-29', heartRate: 70, systolic: 138, 