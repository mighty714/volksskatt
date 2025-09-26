import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaTimes, FaHourglassHalf, FaTimesCircle, FaCalendarAlt, FaUser, FaFilter, FaBell, FaFileAlt, FaBriefcase } from 'react-icons/fa';

// Reusable Action Buttons component
const ActionButtons = ({ onAction }) => (
  <div className="flex items-center gap-3 text-slate-500">
    <button onClick={() => onAction('Approved')} title="Approve" className="hover:text-emerald-600"><FaCheck /></button>
    <button onClick={() => onAction('Rejected')} title="Reject" className="hover:text-rose-600"><FaTimes /></button>
    <button onClick={() => onAction('Waitlist')} title="Waitlist" className="hover:text-amber-600"><FaHourglassHalf /></button>
  </div>
);

// Helpers
const getStatusClasses = (status) => {
  switch (status) {
    case 'Pending': return 'bg-cyan-50 text-cyan-700';
    case 'Approved': return 'bg-emerald-50 text-emerald-700';
    case 'Rejected': return 'bg-rose-50 text-rose-700';
    case 'Waitlist': return 'bg-amber-50 text-amber-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

const getShadowClass = (status) => {
  switch (status) {
    case 'Pending': return 'hover:shadow-cyan-300';
    case 'Approved': return 'hover:shadow-emerald-300';
    case 'Rejected': return 'hover:shadow-rose-300';
    case 'Waitlist': return 'hover:shadow-amber-300';
    default: return 'hover:shadow-gray-300';
  }
};

const getDeptClasses = (dept) => {
  switch (dept) {
    case 'IT': return 'bg-indigo-50 text-indigo-700';
    case 'HR': return 'bg-pink-50 text-pink-700';
    case 'Finance': return 'bg-emerald-50 text-emerald-700';
    default: return 'bg-gray-50 text-gray-700';
  }
};

// Random demo names
const randomNames = ['John Doe','Sarah Smith','Raj Kumar','Anita Rao','Vikram Singh','Priya Sharma','Amit Patel','Emily Thomas'];

export default function Dashboard() {
  const [gradientIndex, setGradientIndex] = useState(0);
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'E101', e: 'John Doe', d: 'IT', t: 'Sick Leave', dates: '24 Sep', s: 'Pending' },
    { id: 'E102', e: 'Sarah Smith', d: 'HR', t: 'Casual Leave', dates: '26-27 Sep', s: 'Pending' },
    { id: 'E103', e: 'Raj Kumar', d: 'Finance', t: 'Annual Leave', dates: '1-5 Oct', s: 'Pending' },
    { id: 'E104', e: 'Anita Rao', d: 'IT', t: 'Sick Leave', dates: '24 Sep', s: 'Approved' },
    { id: 'E105', e: 'Vikram Singh', d: 'Finance', t: 'Annual Leave', dates: '2-4 Oct', s: 'Rejected' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalData, setModalData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef();

  const [nestedModalOpen, setNestedModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    name: '',
    contact: '',
    email: '',
    password: '',
    idProof: '',
    documents: null
  });

  const gradients = [
    'from-emerald-400 via-cyan-400 to-sky-500',
    'from-pink-400 via-red-400 to-yellow-400',
    'from-purple-400 via-pink-400 to-red-400',
    'from-indigo-400 via-purple-400 to-pink-400'
  ];

  useEffect(() => {
    const gradInterval = setInterval(() => {
      setGradientIndex(prev => (prev + 1) % gradients.length);
    }, 3000);
    return () => clearInterval(gradInterval);
  }, []);

  const cardVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const rowVariants = { hidden: { opacity: 0, x: -50 }, visible: i => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 } }) };
  const hoverVariants = { hover: { scale: 1.03, transition: { duration: 0.3 } } };

  const summaryCounts = {
    Pending: leaveRequests.filter(l => l.s === 'Pending').length,
    Approved: leaveRequests.filter(l => l.s === 'Approved').length,
    Rejected: leaveRequests.filter(l => l.s === 'Rejected').length,
    Waitlist: leaveRequests.filter(l => l.s === 'Waitlist').length,
  };

  const totalEmployees = 120;
  const onLeave = summaryCounts.Approved + summaryCounts.Waitlist + summaryCounts.Pending;
  const presentToday = totalEmployees - onLeave;
  const lateCheckIns = 6;

  const employeeData = [
    { label: 'Total Employees', value: totalEmployees, color: 'text-slate-800', bg: 'bg-white' },
    { label: 'On Leave', value: onLeave, color: 'text-amber-600', bg: 'bg-white' },
    { label: 'New Joinees', value: 5, color: 'text-emerald-600', bg: 'bg-white' },
    { label: 'Resigned', value: 2, color: 'text-rose-600', bg: 'bg-white' },
  ];

  const hrQuickActions = [
    { title: '➕ Add New Employee', icon: <FaFileAlt />, action: () => setAddEmployeeOpen(true) },
    { title: '📄 Generate Offer', icon: <FaFileAlt />, action: () => alert('Offer Generation') },
    { title: '📝 Employee Feedback', icon: <FaFileAlt />, action: () => alert('Feedback') },
    { title: '📊 Reports', icon: <FaBriefcase />, action: () => alert('Reports') },
  ];

  const handleAction = (index, action) => {
    const updatedRequests = [...leaveRequests];
    updatedRequests[index].s = action;
    setLeaveRequests(updatedRequests);
  };

  const handleCardClick = (type) => {
    setModalTitle(type);
    let data = [];
    const statusMap = {
      'Pending Requests': 'Pending',
      'Approved': 'Approved',
      'Rejected': 'Rejected',
      'Waitlist': 'Waitlist'
    };
    if (statusMap[type]) {
      data = leaveRequests.filter(l => l.s === statusMap[type]);
    } else {
      switch (type) {
        case 'Total Employees':
          data = Array.from({ length: totalEmployees }, (_, i) => ({
            id: `E${101 + i}`,
            e: randomNames[i % randomNames.length],
            d: ['IT', 'HR', 'Finance'][i % 3],
            t: '', dates: '', s: '',
            experience: `${1 + (i % 10)} yrs`,
            salary: 30000 + (i % 10) * 5000,
            role: ['Developer', 'Manager', 'Analyst'][i % 3],
            position: ['Junior', 'Mid', 'Senior'][i % 3]
          }));
          break;
        case 'On Leave':
          data = leaveRequests.filter(l => l.s !== 'Rejected'); 
          break;
        case 'New Joinees':
          data = Array.from({ length: 5 }, (_, i) => ({
            id: `N${301 + i}`,
            e: randomNames[i % randomNames.length],
            d: ['IT','HR','Finance'][i % 3],
            t: 'Joining',
            dates: 'Sep 2025',
            s: 'New'
          }));
          break;
        case 'Resigned':
          data = Array.from({ length: 2 }, (_, i) => ({
            id: `R${401 + i}`,
            e: randomNames[i % randomNames.length],
            d: ['IT','HR','Finance'][i % 3],
            t: 'Resigned',
            dates: 'Sep 2025',
            s: 'Exited'
          }));
          break;
        case 'Present Today':
          data = Array.from({ length: presentToday }, (_, i) => ({ id: `P${101+i}`, e: `Employee ${i+1}`, d: '', t: '', dates: '', s: '' }));
          break;
        case 'Late Check-ins':
          data = Array.from({ length: lateCheckIns }, (_, i) => ({ id: `L${120+i}`, e: `Employee ${i+1}`, d: '', t: '', dates: '', s: '' }));
          break;
        default:
          data = [];
      }
    }
    setModalData(data);
    setModalOpen(true);
  };

  const handleAddEmployee = (e) => {
    e.preventDefault();
    setAddEmployeeOpen(false);
    setNewEmployee({ id: '', name: '', contact: '', email: '', password: '', idProof: '', documents: null });
    alert("Employee Added Successfully!");
  };

  useEffect(() => {
    const handleEsc = (event) => { if (event.key === 'Escape') { setModalOpen(false); setNestedModalOpen(false); setAddEmployeeOpen(false); } };
    const handleClickOutside = (event) => { if (filterRef.current && !filterRef.current.contains(event.target)) setFilterOpen(false); };
    window.addEventListener('keydown', handleEsc);
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleEsc);
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Employee Overview */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {employeeData.map((card, idx) => (
          <motion.div key={idx} variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
            className={`rounded-2xl shadow-md border p-4 ${card.bg} cursor-pointer`}
            onClick={() => handleCardClick(card.label)}
          >
            <p className="text-sm text-slate-500">{card.label}</p>
            <h2 className={`text-2xl font-bold ${card.color}`}>{card.value}</h2>
          </motion.div>
        ))}
      </section>

      {/* HR Quick Actions */}
      <section className="grid md:grid-cols-4 gap-4">
        {hrQuickActions.map((action, idx) => (
          <motion.div key={idx} variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
            className="bg-white rounded-xl border p-4 flex items-center gap-3 cursor-pointer"
            onClick={action.action}
          >
            <span className="text-xl">{action.icon}</span>
            <span className="font-medium text-slate-800">{action.title}</span>
          </motion.div>
        ))}
      </section>

       {/* Attendance & Leave */}
      <section className="bg-white rounded-2xl shadow-md border p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800">Attendance & Leave</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          {[ 
            { label: 'Present Today', value: presentToday, bg: 'bg-emerald-50', color: 'text-emerald-800' },
            { label: 'Pending Requests', value: summaryCounts.Pending, bg: 'bg-cyan-50', color: 'text-cyan-800' },
            { label: 'Approved', value: summaryCounts.Approved, bg: 'bg-emerald-50', color: 'text-emerald-800' },
            { label: 'Rejected', value: summaryCounts.Rejected, bg: 'bg-rose-50', color: 'text-rose-800' },
            { label: 'Waitlist', value: summaryCounts.Waitlist, bg: 'bg-amber-50', color: 'text-amber-800' },
            { label: 'Late Check-ins', value: lateCheckIns, bg: 'bg-rose-100', color: 'text-rose-800' },
          ].map((card, idx) => (
            <motion.div key={idx} variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
              className={`rounded-xl p-4 text-center cursor-pointer ${card.bg}`}
              onClick={() => handleCardClick(card.label)}
            >
              <p className={`text-sm ${card.color}`}>{card.label}</p>
              <h3 className={`text-xl font-bold ${card.color}`}>{card.value}</h3>
            </motion.div>
          ))}
        </div>

        {/* Leave Requests Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="text-slate-700 text-sm font-medium">
                <th className="px-6 py-3">Employee ID</th>
                <th className="px-6 py-3">Employee</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-6 py-3">Dates</th>
                <th className="px-6 py-3 relative">
                  Status
                  <div className="inline-block ml-2 relative" ref={filterRef}>
                    <button onClick={() => setFilterOpen(prev => !prev)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                      <FaFilter />
                    </button>
                    {filterOpen && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute top-10 left-0 w-32 bg-white border rounded shadow-md z-10">
                        {['All', 'Approved', 'Rejected', 'Pending', 'Waitlist'].map(status => (
                          <div key={status} onClick={() => { setFilterStatus(status); setFilterOpen(false); }}
                            className={`px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 ${
                              status === 'Approved' ? 'text-emerald-700' :
                              status === 'Rejected' ? 'text-rose-700' :
                              status === 'Pending' ? 'text-cyan-700' :
                              status === 'Waitlist' ? 'text-amber-700' : 'text-gray-700'
                            }`}
                          >
                            {status}
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                </th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {leaveRequests.filter(row => filterStatus === 'All' || row.s === filterStatus).map((row, idx) => (
                <motion.tr key={idx} custom={idx} variants={rowVariants} initial="hidden" animate="visible" whileHover={{ scale: 1.02 }}
                  className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{row.id}</td>
                  <td className="px-6 py-3">{row.e}</td>
                  <td className="px-6 py-3">{row.d}</td>
                  <td className="px-6 py-3">{row.t}</td>
                  <td className="px-6 py-3">{row.dates}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClasses(row.s)}`}>{row.s}</span>
                  </td>
                  <td className="px-6 py-3">
                    <ActionButtons onAction={(action) => handleAction(idx, action)} />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Employee Modal */}
      {addEmployeeOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setAddEmployeeOpen(false)}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-4 border-b bg-white z-10">
              <h2 className="text-lg font-semibold text-black">Add New Employee</h2>
              <button onClick={() => setAddEmployeeOpen(false)} className="text-black hover:text-rose-600">
                <FaTimesCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleAddEmployee} className="flex-1 overflow-y-auto p-4 space-y-3 text-slate-800">
              <input type="text" placeholder="Employee ID" value={newEmployee.id} onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="text" placeholder="Employee Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="text" placeholder="Contact Details" value={newEmployee.contact} onChange={(e) => setNewEmployee({ ...newEmployee, contact: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="email" placeholder="Email" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="password" placeholder="Password" value={newEmployee.password} onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="text" placeholder="ID Proof" value={newEmployee.idProof} onChange={(e) => setNewEmployee({ ...newEmployee, idProof: e.target.value })}
                className="w-full border rounded p-2" required />
              <input type="file" onChange={(e) => setNewEmployee({ ...newEmployee, documents: e.target.files[0] })}
                className="w-full border rounded p-2" />
              
              <button type="submit" className="w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700">Add Employee</button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Existing Modals... (modalOpen, nestedModalOpen remain unchanged) */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setModalOpen(false)}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-black">{modalTitle}</h2>
              <button onClick={() => setModalOpen(false)} className="text-black hover:text-rose-600">
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {modalData.length ? modalData.map((item, idx) => (
                <motion.div key={idx} whileHover={{ scale: 1.02 }}
                  className={`p-3 bg-gray-100 rounded-lg text-black shadow-sm flex flex-col space-y-1 ${getShadowClass(item.s)}`}
                  onClick={() => { setSelectedEmployee(item); setNestedModalOpen(true); }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-slate-600" />
                      <span className="font-medium">{item.id} - {item.e}</span>
                    </div>
                    {item.d && <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDeptClasses(item.d)}`}>{item.d}</span>}
                  </div>
                  {item.t && (
                    <div className="flex items-center gap-2 text-slate-700 text-sm">
                      <FaCalendarAlt />
                      <span>{item.t} {item.dates}</span>
                    </div>
                  )}
                  {item.s && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(item.s)}`}>{item.s}</span>
                  )}
                </motion.div>
              )) : (
                <div className="p-2 text-gray-600">No employees found</div>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {nestedModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setNestedModalOpen(false)}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}>
            
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-semibold text-black">{selectedEmployee.e} - Details</h2>
              <button onClick={() => setNestedModalOpen(false)} className="text-black hover:text-rose-600">
                <FaTimesCircle size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-slate-800">
              <div className="p-3 bg-gray-100 rounded-lg shadow-sm space-y-1">
                <div><strong>Employee ID:</strong> {selectedEmployee.id}</div>
                <div><strong>Department:</strong> {selectedEmployee.d}</div>
                <div><strong>Role:</strong> {selectedEmployee.role}</div>
                <div><strong>Position:</strong> {selectedEmployee.position}</div>
                <div><strong>Experience:</strong> {selectedEmployee.experience}</div>
                <div><strong>Salary:</strong> ₹{selectedEmployee.salary?.toLocaleString()}</div>
                {selectedEmployee.dates && <div><strong>Type/Dates:</strong> {selectedEmployee.t} {selectedEmployee.dates}</div>}
                {selectedEmployee.s && <div><strong>Status:</strong> {selectedEmployee.s}</div>}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Performance & Engagement */}
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Performance & Engagement</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
            className="bg-emerald-50 border rounded-xl p-4">
            <h3 className="text-md font-semibold text-emerald-800 mb-3">🌟 Top Performers</h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li className="flex justify-between"><span>Priya Sharma (IT)</span><span className="font-medium text-slate-900">95%</span></li>
              <li className="flex justify-between"><span>Amit Patel (Finance)</span><span className="font-medium text-slate-900">92%</span></li>
              <li className="flex justify-between"><span>Emily Thomas (HR)</span><span className="font-medium text-slate-900">90%</span></li>
            </ul>
          </motion.div>

          <motion.div variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
            className="bg-cyan-50 border rounded-xl p-4">
            <h3 className="text-md font-semibold text-cyan-800 mb-3">📑 Ongoing Appraisals</h3>
            <ul className="space-y-2 text-slate-700 text-sm">
              <li className="flex justify-between"><span>Team A</span><span className="font-medium text-slate-900">80% Completed</span></li>
              <li className="flex justify-between"><span>Team B</span><span className="font-medium text-slate-900">65% Completed</span></li>
              <li className="flex justify-between"><span>Team C</span><span className="font-medium text-slate-900">50% Completed</span></li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* HR Activities */}
      <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">HR Activities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[ 
            { title: '📅 Upcoming Holidays', color: 'emerald', items: [['Gandhi Jayanti', '02/10'], ['Diwali', '12/11'], ['Christmas', '25/12']] },
            { title: '🎂 Birthdays This Month', color: 'rose', items: [['Neha Verma (Finance)', '28/09'], ['Rahul Mehta (IT)', '05/10'], ['Lisa George (HR)', '15/10']] },
            { title: '🎉 Company Events', color: 'cyan', items: [['Quarterly Townhall', '30/09'], ['Team Building Retreat', '20/10'], ['Annual Day Celebration', '15/12']] }
          ].map((card, idx) => (
            <motion.div key={idx} variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
              className={`bg-${card.color}-50 border rounded-xl p-4`}>
              <h3 className={`text-md font-semibold text-${card.color}-800 mb-3`}>{card.title}</h3>
              <ul className="space-y-2 text-slate-700 text-sm">
                {card.items.map((item, i) => (
                  <li key={i} className="flex justify-between"><span>{item[0]}</span><span className="font-medium text-slate-900">{item[1]}</span></li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

    <section className="bg-white rounded-2xl shadow-sm border p-4 md:p-6">
  <h2 className="text-lg font-semibold text-slate-800 mb-4">Advanced HR Features</h2>
  <div className="grid md:grid-cols-3 gap-6">
    {[
      { 
        title: '📚 Upcoming Trainings', 
        color: 'purple', 
        textColor: 'text-purple-800', 
        items: [['Leadership Training', '05/10'], ['Agile Workshop', '12/10'], ['Communication Skills', '20/10'], ['JavaScript Training', '25/10']] 
      },
      { 
        title: '📝 Policy Updates', 
        color: 'cyan', 
        textColor: 'text-cyan-800', 
        items: [['Leave Policy', '01/10'], ['Remote Work Policy', '15/10'], ['Travel Policy', '30/10'], ['Code of Conduct', '05/11']] 
      },
      { 
        title: '🏆 Employee Recognition', 
        color: 'yellow', 
        textColor: 'text-amber-800', 
        items: [['Priya Sharma - Star Performer', 'Sep'], ['Amit Patel - Excellent Teamwork', 'Sep'], ['Emily Thomas - Best Innovator', 'Sep'], ['Rahul Mehta - Customer Champion', 'Sep']] 
      }
    ].map((card, idx) => (
      <motion.div key={idx} variants={cardVariants} initial="hidden" animate="visible" whileHover={hoverVariants.hover}
        className={`bg-${card.color}-50 border rounded-xl p-4`}>
        <h3 className={`text-md font-semibold ${card.textColor} mb-3`}>{card.title}</h3>
        <ul className="space-y-2 text-slate-700 text-sm">
          {card.items.map((item, i) => (
            <li key={i} className="flex justify-between">
              <span>{item[0]}</span>
              <span className="font-medium text-slate-900">{item[1]}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    ))}
  </div>
</section>
    </div>
  );
}