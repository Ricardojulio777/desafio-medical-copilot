import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  // Header com Logo
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #2563EB', paddingBottom: 15, marginBottom: 20 },
  logo: { width: 50, height: 50 },
  headerText: { alignItems: 'flex-end' },
  title: { fontSize: 18, color: '#1E293B', fontFamily: 'Helvetica-Bold' },
  subtitle: { fontSize: 10, color: '#64748B', marginTop: 4 },
  
  section: { marginBottom: 15 },
  label: { fontSize: 12, color: '#2563EB', fontFamily: 'Helvetica-Bold', marginBottom: 4 },
  text: { fontSize: 10, color: '#334155', lineHeight: 1.5 },
  
  // Chat
  chatContainer: { marginTop: 5, marginBottom: 15, padding: 10, backgroundColor: '#F8FAFC', borderRadius: 5 },
  chatBubbleDoc: { marginBottom: 4, fontSize: 10, color: '#1E40AF', fontFamily: 'Helvetica-Bold' },
  chatBubblePat: { marginBottom: 8, fontSize: 10, color: '#475569', marginLeft: 10, fontStyle: 'italic' },
  
  disclaimer: { position: 'absolute', bottom: 30, left: 40, right: 40, textAlign: 'center', fontSize: 8, color: '#94A3B8', borderTop: '1px solid #eee', paddingTop: 10 }
});

// URL de um logo médico genérico (substitua pela URL do seu logo se quiser)
const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3063/3063176.png";

export const MedicalPDF = ({ data, transcript, doctorName }: { data: any, transcript: string, doctorName: string }) => {
  if (!data) return <Document><Page><Text>Carregando...</Text></Page></Document>;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Cabeçalho com Logo */}
        <View style={styles.headerContainer}>
           <Image src={LOGO_URL} style={styles.logo} />
           <View style={styles.headerText}>
              <Text style={styles.title}>Prontuário Médico</Text>
              <Text style={styles.subtitle}>Co-Pilot Inteligente • Dr(a). {doctorName}</Text>
              <Text style={{ fontSize: 9, color: '#94A3B8', marginTop: 2 }}>{new Date().toLocaleDateString()}</Text>
           </View>
        </View>

        {/* Transcrição Diarizada */}
        <View style={styles.section}>
          <Text style={styles.label}>Transcrição da Consulta:</Text>
          <View style={styles.chatContainer}>
            {data.dialogo_estruturado ? (
                data.dialogo_estruturado.map((fala: any, i: number) => (
                    <Text key={i} style={fala.falante === 'Médico' ? styles.chatBubbleDoc : styles.chatBubblePat}>
                        {fala.falante}: {fala.texto}
                    </Text>
                ))
            ) : (
                <Text style={styles.text}>{transcript}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Hipótese Diagnóstica:</Text>
          <Text style={styles.text}>{data.diagnostico_provavel}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Conduta / Medicamentos:</Text>
          {data.medicamentos_comuns?.map((item: string, i: number) => (
              <Text key={i} style={styles.text}>• {item}</Text>
          ))}
        </View>

        <View style={styles.disclaimer}>
           <Text>Documento gerado via Co-Pilot Médico para o Dr(a). {doctorName}. Necessária validação clínica.</Text>
        </View>

      </Page>
    </Document>
  );
};