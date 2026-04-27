import { createClient } from '@supabase/supabase-js';

// Kadio AI - Outils et Executeur d'agents

export function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export const TOOLS = [
  { name: 'book_appointment', description: 'Reserver un rendez-vous pour un client.', input_schema: { type: 'object', properties: { client_name: { type: 'string', description: 'Nom du client' }, service: { type: 'string', description: 'Type de service' }, date: { type: 'string', description: 'Date (YYYY-MM-DD)' }, time: { type: 'string', description: 'Heure (HH:MM)' }, stylist: { type: 'string', description: 'Coiffeur prefere' } }, required: ['client_name', 'service', 'date', 'time'] } },
  { name: 'check_schedule', description: 'Verifier les disponibilites du salon.', input_schema: { type: 'object', properties: { date: { type: 'string', description: 'Date (YYYY-MM-DD)' }, stylist: { type: 'string', description: 'Coiffeur specifique' } }, required: ['date'] } },
  { name: 'get_client_info', description: 'Rechercher un client existant.', input_schema: { type: 'object', properties: { name: { type: 'string', description: 'Nom du client' }, phone: { type: 'string', description: 'Telephone' } }, required: ['name'] } },
  { name: 'send_sms', description: 'Envoyer un SMS a un client.', input_schema: { type: 'object', properties: { to: { type: 'string', description: 'Numero' }, message: { type: 'string', description: 'Contenu du SMS' } }, required: ['to', 'message'] } },
  { name: 'get_business_stats', description: 'Obtenir les stats business.', input_schema: { type: 'object', properties: { period: { type: 'string', enum: ['today', 'week', 'month', 'year'], description: 'Periode' } }, required: ['period'] } },
  { name: 'manage_employee', description: 'Gerer un employe.', input_schema: { type: 'object', properties: { action: { type: 'string', enum: ['get_schedule', 'set_schedule', 'get_info', 'list_all'] }, employee_name: { type: 'string' }, data: { type: 'object' } }, required: ['action'] } },
  { name: 'create_transaction', description: 'Creer une transaction financiere.', input_schema: { type: 'object', properties: { type: { type: 'string', enum: ['payment', 'expense', 'transfer'] }, amount: { type: 'number' }, description: { type: 'string' }, client_name: { type: 'string' } }, required: ['type', 'amount', 'description'] } },
  { name: 'manage_inventory', description: 'Gerer inventaire produits.', input_schema: { type: 'object', properties: { action: { type: 'string', enum: ['check_stock', 'add_stock', 'low_stock_alert', 'list_products'] }, product_name: { type: 'string' }, quantity: { type: 'number' } }, required: ['action'] } },
];

export async function executeTool(toolName, toolInput, supabase) {
  try {
    switch (toolName) {
      case 'book_appointment': {
        const { client_name, service, date, time, stylist } = toolInput;
        let { data: client } = await supabase.from('clients').select('id').or('prenom.ilike.%' + client_name + '%,nom.ilike.%' + client_name + '%').limit(1).single();
        const { data: rdv, error } = await supabase.from('appointments').insert({ client_id: client?.id || null, client_name, service, date, time, stylist: stylist || null, status: 'confirmed', created_by: 'ai_assistant' }).select().single();
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'RDV confirme pour ' + client_name + ' le ' + date + ' a ' + time + ' pour ' + service + '.', rdv_id: rdv?.id };
      }
      case 'check_schedule': {
        const { date, stylist } = toolInput;
        let query = supabase.from('appointments').select('time, service, client_name, stylist, status').eq('date', date).neq('status', 'cancelled');
        if (stylist) query = query.ilike('stylist', '%' + stylist + '%');
        const { data: rdvs } = await query.order('time');
        if (!rdvs || rdvs.length === 0) return { available: true, message: 'Le ' + date + ' est completement libre.' };
        return { available: true, booked_slots: rdvs.map(r => r.time + ' - ' + r.service), total_rdv: rdvs.length };
      }
      case 'get_client_info': {
        const { name, phone } = toolInput;
        let query = supabase.from('clients').select('*');
        if (phone) { query = query.eq('telephone', phone); } else { query = query.or('prenom.ilike.%' + name + '%,nom.ilike.%' + name + '%'); }
        const { data: clients } = await query.limit(5);
        if (!clients || clients.length === 0) return { found: false, message: 'Aucun client trouve.' };
        return { found: true, clients: clients.map(c => ({ id: c.id, nom: (c.prenom || '') + ' ' + (c.nom || ''), telephone: c.telephone, email: c.email })) };
      }
      case 'send_sms': {
        const { to, message } = toolInput;
        const sid = process.env.TWILIO_ACCOUNT_SID, token = process.env.TWILIO_AUTH_TOKEN, from = process.env.TWILIO_PHONE_NUMBER;
        if (sid && token && from) {
          const res = await fetch('https://api.twilio.com/2010-04-01/Accounts/' + sid + '/Messages.json', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + Buffer.from(sid + ':' + token).toString('base64') }, body: new URLSearchParams({ To: to, From: from, Body: message }) });
          const data = await res.json();
          if (data.sid) return { success: true, message: 'SMS envoye a ' + to };
          return { success: false, error: data.message || 'Erreur Twilio' };
        }
        return { success: true, message: 'SMS en file d\'attente pour ' + to };
      }
      case 'get_business_stats': {
        const { period } = toolInput;
        const now = new Date();
        let startDate;
        switch (period) {
          case 'today': startDate = now.toISOString().split('T')[0]; break;
          case 'week': startDate = new Date(now - 7 * 86400000).toISOString().split('T')[0]; break;
          case 'month': startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]; break;
          case 'year': startDate = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]; break;
        }
        const [transRes, rdvRes, clientsRes] = await Promise.all([
          supabase.from('transactions').select('montant').gte('created_at', startDate),
          supabase.from('appointments').select('id').gte('date', startDate).neq('status', 'cancelled'),
          supabase.from('clients').select('id', { count: 'exact' }),
        ]);
        const revenue = (transRes.data || []).reduce((sum, t) => sum + (t.montant || 0), 0);
        return { period, revenue, total_rdv: rdvRes.data?.length || 0, total_clients: clientsRes.count || 0 };
      }
      case 'manage_employee': {
        const { action, employee_name } = toolInput;
        if (action === 'list_all') { const { data } = await supabase.from('employees').select('prenom, nom, role, specialite, actif').eq('actif', true); return { employees: data || [] }; }
        if (action === 'get_info' && employee_name) { const { data } = await supabase.from('employees').select('*').or('prenom.ilike.%' + employee_name + '%,nom.ilike.%' + employee_name + '%').limit(1).single(); return data ? { found: true, employee: data } : { found: false }; }
        return { message: 'Action pas encore implementee.' };
      }
      case 'create_transaction': {
        const { type, amount, description, client_name } = toolInput;
        const { error } = await supabase.from('transactions').insert({ type, montant: amount, description, client_name: client_name || null, status: 'completed', created_by: 'ai_assistant' }).select().single();
        if (error) return { success: false, error: error.message };
        return { success: true, message: 'Transaction de ' + amount + '$ enregistree.' };
      }
      case 'manage_inventory': {
        const { action, product_name } = toolInput;
        if (action === 'list_products') { const { data } = await supabase.from('products').select('nom, prix, stock, categorie').order('nom'); return { products: data || [] }; }
        if (action === 'check_stock' && product_name) { const { data } = await supabase.from('products').select('nom, stock, prix').ilike('nom', '%' + product_name + '%'); return { products: data || [] }; }
        if (action === 'low_stock_alert') { const { data } = await supabase.from('products').select('nom, stock').lt('stock', 5); return { low_stock: data || [] }; }
        return { message: 'Action inventaire pas encore implementee.' };
      }
      default: return { error: 'Outil non reconnu.' };
    }
  } catch (err) {
    console.error('Tool error:', err.message);
    return { error: err.message };
  }
                                                                                                                                   }
