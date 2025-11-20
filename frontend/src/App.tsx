import { useState, useRef, useEffect } from 'react';
import { 
  Mic, MicOff, Activity, Download, Loader2, Clock, Plus, 
  FileText, Trash2, User, Stethoscope, MessageSquare, LogOut, Lock 
} from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { MedicalPDF } from './components/MedicalPDF';

interface Consultation {
  id: string;
  date: string;
  transcript: string;
  result: any;
}

function App() {
  // --- ESTADOS DE LOGIN ---
  const [doctorName, setDoctorName] = useState(''); // Nome digitado no input
  const [currentUser, setCurrentUser] = useState<string | null>(null); // Usuário logado

  // --- ESTADOS DO APP ---
  const [view, setView] = useState<'new' | 'history'>('new'); 
  const [history, setHistory] = useState<Consultation[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  // --- EFEITO: Carregar histórico SÓ do médico logado ---
  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`history_${currentUser}`);
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]); // Se for médico novo, histórico vazio
      }
    }
  }, [currentUser]);

  // --- CONFIG VOZ ---
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      
      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setTranscript(prev => prev + ' ' + event.results[i][0].transcript);
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };
      recognition.onend = () => setIsRecording(false);
      recognitionRef.current = recognition;
    }
  }, []);

  // --- FUNÇÕES ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorName.trim()) return;
    setCurrentUser(doctorName);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setDoctorName('');
    setResult(null);
    setTranscript('');
  };

  const toggleMic = () => {
    if (!recognitionRef.current) return alert("Sem suporte a voz");
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript('');
      setResult(null);
      try { recognitionRef.current.start(); setIsRecording(true); } catch (e) {}
    }
  };

  const analyze = async () => {
    if (!transcript) return;
    setLoading(true);
    try {
      const req = await fetch('http://localhost:3000/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcript })
      });
      const data = await req.json();
      setResult(data);

      // Salvar no histórico ESPECÍFICO do usuário
      const newConsultation: Consultation = {
        id: Date.now().toString(),
        date: new Date().toLocaleString('pt-BR'),
        transcript: transcript,
        result: data
      };
      
      const updatedHistory = [newConsultation, ...history];
      setHistory(updatedHistory);
      localStorage.setItem(`history_${currentUser}`, JSON.stringify(updatedHistory));

    } catch (e) {
      alert('Erro no backend.');
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = (id: string) => {
    const newHistory = history.filter(item => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem(`history_${currentUser}`, JSON.stringify(newHistory));
  };

  // === TELA DE LOGIN (Se não tiver usuário) ===
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
               <Stethoscope size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">Co-Pilot Médico</h1>
          <p className="text-center text-slate-500 mb-8">Identifique-se para acessar seus prontuários.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Médico / CRM</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={20}/>
                <input 
                  type="text" 
                  className="w-full pl-10 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Ex: Dr. Júlio"
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
               <Lock size={18}/> Acessar Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // === TELA DO SISTEMA (Se tiver usuário) ===
  return (
    <div className="flex h-screen bg-[#F3F4F6] font-sans text-slate-800">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <Stethoscope size={22} />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-800 block leading-tight">Co-Pilot</span>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Médico</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-2">
          <button onClick={() => { setView('new'); setResult(null); setTranscript(''); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'new' ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Plus size={20} /> Nova Consulta
          </button>
          <button onClick={() => setView('history')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${view === 'history' ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100' : 'text-slate-600 hover:bg-slate-50'}`}>
            <Clock size={20} /> Histórico
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <User size={20}/>
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">{currentUser}</p>
                <p className="text-xs text-green-600 font-medium">● Online</p>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors">
              <LogOut size={14}/> Sair da Conta
           </button>
        </div>
      </aside>

      {/* PRINCIPAL */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>
        
        {view === 'new' ? (
          <div className="max-w-6xl mx-auto animate-fade-in">
            <header className="mb-8 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Olá, {currentUser} 👋</h1>
                <p className="text-slate-500 mt-1">Sala de Atendimento Inteligente.</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* GRAVAÇÃO */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[600px] flex flex-col">
                   <div className="flex justify-between items-center mb-4">
                      <label className="text-sm font-bold text-slate-700 flex items-center gap-2"><Mic size={16} className="text-blue-500"/> Áudio Bruto</label>
                      {isRecording && <span className="text-xs font-bold text-red-500 animate-pulse">● GRAVANDO</span>}
                   </div>
                   <textarea 
                      className="flex-1 w-full bg-slate-50 p-5 rounded-xl resize-none border-0 focus:ring-2 focus:ring-blue-500 text-slate-700 text-lg"
                      placeholder="Inicie a consulta..."
                      value={transcript}
                      onChange={e => setTranscript(e.target.value)}
                   />
                   <div className="mt-4 grid grid-cols-2 gap-4">
                      <button onClick={toggleMic} className={`py-4 rounded-xl font-bold flex justify-center items-center gap-2 ${isRecording ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-900 text-white'}`}>
                        {isRecording ? <><MicOff/> Parar</> : <><Mic/> Gravar</>}
                      </button>
                      <button onClick={analyze} disabled={loading || !transcript} className="py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-50 flex justify-center gap-2 items-center">
                        {loading ? <Loader2 className="animate-spin"/> : <><Activity size={20}/> Finalizar Consulta</>}
                      </button>
                   </div>
              </div>

              {/* RESULTADO */}
              <div className="h-[600px]">
                 {result ? (
                   <div className="bg-white p-0 rounded-2xl border border-slate-200 shadow-md h-full overflow-y-auto flex flex-col">
                      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2"><FileText size={24} className="text-blue-200"/> Prontuário</h2>
                      </div>

                      <div className="p-8 space-y-8 flex-1">
                        {/* DIÁLOGO */}
                        {result.dialogo_estruturado && (
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-500 uppercase mb-2 flex items-center gap-2"><MessageSquare size={16}/> Diálogo</h3>
                                <div className="space-y-3 max-h-60 overflow-y-auto bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    {result.dialogo_estruturado.map((fala: any, i: number) => (
                                        <div key={i} className={`flex flex-col ${fala.falante === 'Médico' ? 'items-end' : 'items-start'}`}>
                                            <span className={`text-xs font-bold mb-1 ${fala.falante === 'Médico' ? 'text-blue-600' : 'text-slate-500'}`}>{fala.falante}</span>
                                            <div className={`p-3 rounded-lg text-sm max-w-[90%] ${fala.falante === 'Médico' ? 'bg-blue-100 text-blue-900 rounded-tr-none' : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none'}`}>
                                                {fala.texto}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="relative pl-4 border-l-4 border-blue-500">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide block mb-1">Diagnóstico</span>
                          <p className="text-xl font-medium text-slate-900">{result.diagnostico_provavel}</p>
                        </div>
                        
                        {/* MEDICAMENTOS & EXAMES */}
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                             <h4 className="font-bold text-slate-500 text-xs uppercase mb-2">Medicamentos</h4>
                             {result.medicamentos_comuns?.map((m:string,i:number) => <div key={i} className="text-sm text-slate-700 mb-1">• {m}</div>)}
                           </div>
                           <div>
                             <h4 className="font-bold text-slate-500 text-xs uppercase mb-2">Exames</h4>
                             {result.exames_sugeridos?.map((m:string,i:number) => <div key={i} className="text-sm text-slate-700 mb-1">• {m}</div>)}
                           </div>
                        </div>
                      </div>

                      <div className="p-6 border-t border-slate-100 bg-slate-50">
                         <PDFDownloadLink 
                            document={<MedicalPDF data={result} transcript={transcript} doctorName={currentUser} />} 
                            fileName={`prontuario_${Date.now()}.pdf`}
                            className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-colors"
                         >
                            {({ loading }) => loading ? 'Gerando PDF...' : <><Download size={20}/> Baixar PDF</>}
                         </PDFDownloadLink>
                      </div>
                   </div>
                 ) : (
                   <div className="h-full rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
                      {loading ? <Loader2 className="animate-spin text-blue-600" size={40}/> : <><Activity size={48} className="mb-4 opacity-20"/><p>Aguardando consulta</p></>}
                   </div>
                 )}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto animate-fade-in">
             <h1 className="text-2xl font-bold mb-6">Histórico de {currentUser}</h1>
             <div className="space-y-4">
              {history.length === 0 && <div className="text-slate-400">Sem histórico para este médico.</div>}
              {history.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                    <div>
                         <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-bold">{item.date}</span>
                         <h3 className="font-bold mt-1">{item.result.diagnostico_provavel}</h3>
                    </div>
                    <div className="flex gap-2">
                      <PDFDownloadLink 
                          document={<MedicalPDF data={item.result} transcript={item.transcript} doctorName={currentUser} />} 
                          fileName={`historico.pdf`}
                          className="p-2 text-blue-600 bg-blue-50 rounded-lg"
                      ><Download size={20}/></PDFDownloadLink>
                      <button onClick={() => deleteItem(item.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={20}/></button>
                    </div>
                  </div>
              ))}
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;