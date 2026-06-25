"use client";

// Role settings panel used by students and supervisors.
// The layout mirrors the coordinator settings pattern: a left section list
// opens one configurable settings card on the right.
import { useState } from "react";
import { AppearanceSettings } from "@/components/AppearanceSettings";
import { ChangePasswordPanel } from "@/components/ChangePassword";

type UserSettingsProps={role:"student"|"supervisor";name:string;email:string;onSaved:(message:string)=>void};

export function UserSettings({role,name,email,onSaved}:UserSettingsProps){
  const[reminders,setReminders]=useState(true);
  const[updates,setUpdates]=useState(true);
  const[digest,setDigest]=useState(false);
  const sections=role==="supervisor"?["Profile","Notifications","Supervision","Security","Appearance"]:["Profile","Notifications","Internship","Security","Appearance"];
  const[section,setSection]=useState(sections[0]);
  const title=role==="student"?"Student settings":"Supervisor settings";
  return <div className="role-settings-page configurable-role-settings">
    <section className="role-settings-head"><div><span>ACCOUNT & PREFERENCES</span><h1>{title}</h1><p>Select a settings section to configure your {role==="student"?"internship portal":"supervision portal"} preferences.</p></div><button onClick={()=>onSaved("Settings saved successfully.")}>Save settings</button></section>
    <div className="settings-grid role-settings-grid">
      <aside className="module-card settings-nav role-settings-nav">{sections.map(item=><button className={section===item?"selected":""} onClick={()=>setSection(item)} key={item}>{item}<span>›</span></button>)}</aside>
      <div className="module-card admin-settings-panel role-settings-panel">
        {section==="Profile"&&<section className="settings-section-card inline-settings-section"><header><i>○</i><div><h2>Profile information</h2><p>Personal details connected to your portal account.</p></div></header><div className="role-settings-fields"><label><span>Full name</span><input defaultValue={name}/></label><label><span>Email address</span><input type="email" defaultValue={email}/></label><label><span>Account role</span><input value={role==="student"?"Internship Student":"Field Supervisor"} disabled readOnly/></label>{role==="student"?<label><span>Student ID</span><input value="5201040012" disabled readOnly/></label>:<MultiSettingsDropdown label="Assigned regions" initialValues={["Ashanti","Eastern","Bono"]} options={["Ashanti","Eastern","Bono","Greater Accra","Central","Northern"]}/>}</div></section>}
        {section==="Notifications"&&<section className="settings-section-card inline-settings-section"><header><i>♧</i><div><h2>Notifications</h2><p>Choose which programme updates should reach you.</p></div></header><SettingsToggle title={role==="student"?"Placement and approval updates":"Lesson-note review alerts"} copy="Receive an alert when a record needs attention or changes status." value={updates} setValue={setUpdates}/><SettingsToggle title="Visit reminders" copy={role==="student"?"Remind me before my supervisor arrives.":"Remind me before each scheduled school visit."} value={reminders} setValue={setReminders}/><SettingsToggle title="Weekly email summary" copy="Receive a weekly digest of activity on your account." value={digest} setValue={setDigest}/></section>}
        {(section==="Supervision"||section==="Internship")&&<section className="settings-section-card inline-settings-section"><header><i>⌘</i><div><h2>{role==="student"?"Internship preferences":"Supervision preferences"}</h2><p>{role==="student"?"Defaults used when selecting placements and completing records.":"Defaults used for visits, reviews, assigned regions and availability."}</p></div></header><div className="role-settings-fields">{role==="student"?<><SettingsDropdown label="Preferred region" initialValue="Ashanti" options={["Ashanti","Eastern","Bono","Greater Accra"]}/><SettingsDropdown label="Preferred school category" initialValue="JHS" options={["Basic","JHS","SHS","Technical"]}/></>:<><SettingsDropdown label="Visit reminder lead time" initialValue="24 hours" options={["2 hours","12 hours","24 hours","48 hours"]}/><SettingsDropdown label="Default visit duration" initialValue="60 minutes" options={["30 minutes","45 minutes","60 minutes","90 minutes"]}/><SettingsDropdown label="Availability window" initialValue="Weekdays only" options={["Weekdays only","Monday to Saturday","Flexible schedule"]}/><MultiSettingsDropdown label="Supervision regions" initialValues={["Ashanti","Eastern","Bono"]} options={["Ashanti","Eastern","Bono","Greater Accra","Central","Northern"]}/></>}</div></section>}
        {section==="Security"&&<ChangePasswordPanel role={role} compact onSaved={onSaved}/>}
        {section==="Appearance"&&<AppearanceSettings role={role} compact/>}
      </div>
    </div>
  </div>;
}

function SettingsToggle({title,copy,value,setValue}:{title:string;copy:string;value:boolean;setValue:(value:boolean)=>void}){return <div className="settings-toggle-row"><span><strong>{title}</strong><small>{copy}</small></span><button className={value?"on":""} onClick={()=>setValue(!value)} aria-pressed={value}><i/></button></div>}
function SettingsDropdown({label,initialValue,options}:{label:string;initialValue:string;options:string[]}){const[value,setValue]=useState(initialValue);const[open,setOpen]=useState(false);return <div className="settings-custom-dropdown"><span>{label}</span><button className={open?"open":""} onClick={()=>setOpen(!open)}><b>{value}</b><i>⌄</i></button>{open&&<div className="settings-dropdown-menu">{options.map(option=><button className={option===value?"selected":""} onClick={()=>{setValue(option);setOpen(false)}} key={option}><i>{option===value?"✓":""}</i>{option}</button>)}</div>}</div>}
function MultiSettingsDropdown({label,initialValues,options}:{label:string;initialValues:string[];options:string[]}){const[values,setValues]=useState(initialValues);const[open,setOpen]=useState(false);function toggle(option:string){setValues(values.includes(option)?values.filter(value=>value!==option):[...values,option])}return <div className="settings-custom-dropdown"><span>{label}</span><button className={open?"open":""} onClick={()=>setOpen(!open)}><b>{values.length?`${values.length} selected`:"Select options"}</b><i>⌄</i></button>{open&&<div className="settings-dropdown-menu settings-multi-menu"><small>Multiple selections allowed</small>{options.map(option=><button className={values.includes(option)?"selected":""} onClick={()=>toggle(option)} key={option}><i>{values.includes(option)?"✓":""}</i>{option}</button>)}<button className="settings-dropdown-done" onClick={()=>setOpen(false)}>Done</button></div>}</div>}
