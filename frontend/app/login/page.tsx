export default function LoginPage() {
  return (
    <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100vh',background:'#171717',color:'#fff'}}>
      <h1 style={{marginBottom:24}}>Internship Record Management</h1>
      <form style={{display:'flex',flexDirection:'column',gap:16,minWidth:320,background:'#23272f',padding:32,borderRadius:12,boxShadow:'0 2px 16px #0002'}}>
        <input type="text" placeholder="Username" style={{padding:12,borderRadius:6,border:'1px solid #444',background:'#181a20',color:'#fff'}} />
        <input type="password" placeholder="Password" style={{padding:12,borderRadius:6,border:'1px solid #444',background:'#181a20',color:'#fff'}} />
        <button type="submit" style={{padding:12,borderRadius:6,background:'#2563eb',color:'#fff',fontWeight:600,border:'none',cursor:'pointer'}}>Login</button>
      </form>
    </div>
  );
}
