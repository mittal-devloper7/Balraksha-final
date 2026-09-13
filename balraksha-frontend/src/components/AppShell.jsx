import {useState} from 'react';
import {Menu, X} from 'lucide-react';
import Sidebar from './Sidebar';
export default function AppShell({children,coordinator=false}){const [menuOpen,setMenuOpen]=useState(false);return <div className="app-shell"><button className="mobile-menu-trigger" type="button" aria-label={menuOpen?'Close navigation':'Open navigation'} aria-expanded={menuOpen} onClick={()=>setMenuOpen(v=>!v)}>{menuOpen?<X size={21}/>:<Menu size={21}/>}</button>{menuOpen&&<button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={()=>setMenuOpen(false)}/>}<Sidebar coordinator={coordinator} isOpen={menuOpen} onNavigate={()=>setMenuOpen(false)}/><main className="app-main">{children}</main></div>}
