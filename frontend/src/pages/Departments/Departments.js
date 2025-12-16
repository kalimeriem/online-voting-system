import React, { useState } from 'react';
import './Departments.css';

function Departments() {
  const [search, setSearch] = useState('');
  const [depts, setDepts] = useState([
    {
      id: 1,
      name: 'ENSIA School',
      desc: 'Main school department',
      members: 150,
      role: 'Manager'
    }
  ]);

  const filtered = depts.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      <div className="top">
        <div>
          <h1>Departments</h1>
          <p className="grey">Manage and browse organizational departments</p>
        </div>
        <button className="btn-primary">+ Create Department</button>
      </div>

      <div className="search-wrap">
        <svg className="search-ico" width="16" height="16" fill="none">
          <path d="M7 12C9.76142 12 12 9.76142 12 7C12 4.23858 9.76142 2 7 2C4.23858 2 2 4.23858 2 7C2 9.76142 4.23858 12 7 12Z" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M14 14L10.5 10.5" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
        <input
          type="text"
          placeholder="Search departments..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="card">
        <div className="ico-box blue">
          <svg width="20" height="20" fill="none">
            <path d="M3 7L10 3L17 7V15L10 19L3 15V7Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        </div>
        <div>
          <div className="label">Total Departments</div>
          <div className="big">{depts.length}</div>
        </div>
      </div>

      <h2>All Departments</h2>

      <div className="grid">
        {filtered.map(d => (
          <div key={d.id} className="dept-card">
            <div className="dept-top">
              <div className="ico-box blue">
                <svg width="20" height="20" fill="none">
                  <path d="M3 7L10 3L17 7V15L10 19L3 15V7Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div className="dept-info">
                <div className="dept-row">
                  <span className="dept-name">{d.name}</span>
                  <span className="badge">{d.role}</span>
                </div>
                <div className="grey small">{d.desc}</div>
              </div>
            </div>
            <div className="dept-bot">
              <svg width="14" height="14" fill="none">
                <path d="M9.33333 12.25V11.0833C9.33333 10.4645 9.08781 9.87104 8.65023 9.43346C8.21265 8.99587 7.61921 8.75 7 8.75H3.5C2.88079 8.75 2.28735 8.99587 1.84977 9.43346C1.41219 9.87104 1.16667 10.4645 1.16667 11.0833V12.25M11.6667 12.25V11.0833C11.6663 10.5765 11.5068 10.0829 11.2103 9.67463C10.9138 9.26633 10.4954 8.96256 10.0142 8.80583M8.51417 2.18083C8.99646 2.33718 9.41597 2.64116 9.71328 3.04995C10.0106 3.45873 10.1706 3.95311 10.1706 4.46042C10.1706 4.96772 10.0106 5.4621 9.71328 5.87088C9.41597 6.27967 8.99646 6.58365 8.51417 6.74" stroke="currentColor" strokeWidth="1.2"/>
                <path d="M5.25 5.83333C6.31257 5.83333 7.175 4.9709 7.175 3.90833C7.175 2.84577 6.31257 1.98333 5.25 1.98333C4.18743 1.98333 3.325 2.84577 3.325 3.90833C3.325 4.9709 4.18743 5.83333 5.25 5.83333Z" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              <span className="grey small">{d.members} members</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Departments;