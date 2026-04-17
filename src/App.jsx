import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { NOIR } from '@/lib/utils'

// ── Layouts ──
import PublicLayout      from '@/components/layout/PublicLayout'
import AuthLayout        from '@/components/layout/AuthLayout'
import ClientLayout      from '@/components/layout/ClientLayout'
import PartenaireLayout  from '@/components/layout/PartenaireLayout'
import EmployeLayout     from '@/components/layout/EmployeLayout'
import CandidatLayout    from '@/components/layout/CandidatLayout'
import FournisseurLayout from '@/components/layout/FournisseurLayout'
import AdminLayout       from '@/components/layout/AdminLayout'

// ── Guards ──
import AdminGuard       from '@/components/guards/AdminGuard'
import ClientGuard      from '@/components/guards/ClientGuard'
import PartenaireGuard  from '@/components/guards/PartenaireGuard'
import EmployeGuard     from '@/components/guards/EmployeGuard'
import CandidatGuard    from '@/components/guards/CandidatGuard'
import FournisseurGuard from '@/components/guards/FournisseurGuard'

// ── Public pages ──
const Accueil           = lazy(() => import('@/pages/public/Accueil'))
const ServiceVIP        = lazy(() => import('@/pages/public/ServiceVIP'))
const CommentCaMarche   = lazy(() => import('@/pages/public/CommentCaMarche'))
const Forfaits          = lazy(() => import('@/pages/public/Forfaits'))
const Rejoindre         = lazy(() => import('@/pages/public/Rejoindre'))
const Candidature       = lazy(() => import('@/pages/public/Candidature'))
const Blog              = lazy(() => import('@/pages/public/Blog'))
const BlogArticle       = lazy(() => import('@/pages/public/BlogArticle'))
const CarteCadeau       = lazy(() => import('@/pages/public/CarteCadeau'))
const Tirage            = lazy(() => import('@/pages/public/Tirage'))
const Contact           = lazy(() => import('@/pages/public/Contact'))

// ── Auth pages ──
const Login             = lazy(() => import('@/pages/auth/Login'))
const Inscription       = lazy(() => import('@/pages/auth/Inscription'))
const OTP               = lazy(() => import('@/pages/auth/OTP'))
const ChoixRole         = lazy(() => import('@/pages/auth/ChoixRole'))

// ── Client pages ──
const ClientCarte       = lazy(() => import('@/pages/client/Carte'))
const ClientRDV         = lazy(() => import('@/pages/client/RDV'))
const ClientAbonnement  = lazy(() => import('@/pages/client/Abonnement'))
const ClientHistorique  = lazy(() => import('@/pages/client/Historique'))
const ClientProfil      = lazy(() => import('@/pages/client/Profil'))
const ClientReserver    = lazy(() => import('@/pages/client/Reserver'))
const ClientFactures    = lazy(() => import('@/pages/client/Factures'))
const ClientParrainage  = lazy(() => import('@/pages/client/Parrainage'))
const ClientFidelite    = lazy(() => import('@/pages/client/Fidelite'))

// ── Partenaire pages ──
const PartAccueil       = lazy(() => import('@/pages/partenaire/Accueil'))
const PartRDV           = lazy(() => import('@/pages/partenaire/RDV'))
const PartScanner       = lazy(() => import('@/pages/partenaire/Scanner'))
const PartPortefeuille  = lazy(() => import('@/pages/partenaire/Portefeuille'))
const PartStats         = lazy(() => import('@/pages/partenaire/Stats'))
const PartDisponibilites = lazy(() => import('@/pages/partenaire/Disponibilites'))
const PartSalon          = lazy(() => import('@/pages/partenaire/Salon'))
const PartMateriel       = lazy(() => import('@/pages/partenaire/Materiel'))
const PartCertificat     = lazy(() => import('@/pages/partenaire/Certificat'))
const PartVacances       = lazy(() => import('@/pages/partenaire/Vacances'))
const PartProfil         = lazy(() => import('@/pages/partenaire/Profil'))

// ── Employé pages ──
const EmpAccueil        = lazy(() => import('@/pages/employe/Accueil'))
const EmpCalendrier     = lazy(() => import('@/pages/employe/Calendrier'))
const EmpScanner        = lazy(() => import('@/pages/employe/Scanner'))
const EmpWalkin         = lazy(() => import('@/pages/employe/Walkin'))
const EmpStats          = lazy(() => import('@/pages/employe/Stats'))
const EmpConge          = lazy(() => import('@/pages/employe/Conge'))
const EmpRecompenses    = lazy(() => import('@/pages/employe/Recompenses'))

// ── Candidat pages ──
const CandStatut        = lazy(() => import('@/pages/candidat/Statut'))
const CandFormation     = lazy(() => import('@/pages/candidat/Formation'))
const CandCertificat    = lazy(() => import('@/pages/candidat/Certificat'))
const CandQuiz          = lazy(() => import('@/pages/candidat/Quiz'))

// ── Fournisseur pages ──
const FourCatalogue     = lazy(() => import('@/pages/fournisseur/Catalogue'))
const FourCommandes     = lazy(() => import('@/pages/fournisseur/Commandes'))
const FourPaiements     = lazy(() => import('@/pages/fournisseur/Paiements'))

// ── Admin pages ──
const AdminDashboard    = lazy(() => import('@/pages/admin/Dashboard'))
const AdminCalendrier   = lazy(() => import('@/pages/admin/Calendrier'))
const AdminClients      = lazy(() => import('@/pages/admin/Clients'))
const AdminEmployes     = lazy(() => import('@/pages/admin/Employes'))
const AdminPartenaires  = lazy(() => import('@/pages/admin/Partenaires'))
const AdminCandidats    = lazy(() => import('@/pages/admin/Candidats'))
const AdminFournisseurs = lazy(() => import('@/pages/admin/Fournisseurs'))
const AdminServices     = lazy(() => import('@/pages/admin/Services'))
const AdminProduits     = lazy(() => import('@/pages/admin/Produits'))
const AdminChaises      = lazy(() => import('@/pages/admin/Chaises'))
const AdminTransactions = lazy(() => import('@/pages/admin/Transactions'))
const AdminAbonnements  = lazy(() => import('@/pages/admin/Abonnements'))
const AdminVirements    = lazy(() => import('@/pages/admin/Virements'))
const AdminBlog         = lazy(() => import('@/pages/admin/Blog'))
const AdminSMS          = lazy(() => import('@/pages/admin/SMS'))
const AdminFormation    = lazy(() => import('@/pages/admin/Formation'))
const AdminConfig       = lazy(() => import('@/pages/admin/Config'))
const AdminStats        = lazy(() => import('@/pages/admin/Stats'))
const AdminMigration    = lazy(() => import('@/pages/admin/Migration'))
const AdminParametres   = lazy(() => import('@/pages/admin/Parametres'))

// ── 404 ──
const NotFound          = lazy(() => import('@/pages/NotFound'))

const Loader = () => (
  <div style={{ minHeight: '100vh', background: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ width: '32px', height: '32px', border: '2px solid rgba(14,12,9,0.08)', borderTop: '2px solid #0E0C09', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
  </div>
)

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename="/app">
        <Suspense fallback={<Loader />}>
          <Routes>

            {/* ── Public ── */}
            <Route element={<PublicLayout />}>
              <Route index element={<Accueil />} />
              <Route path="comment-ca-marche" element={<CommentCaMarche />} />
              <Route path="forfaits"          element={<Forfaits />} />
              <Route path="rejoindre"         element={<Rejoindre />} />
              <Route path="candidature"       element={<Candidature />} />
              <Route path="blog"              element={<Blog />} />
              <Route path="blog/:slug"        element={<BlogArticle />} />
              <Route path="cartes-cadeaux"    element={<CarteCadeau />} />
              <Route path="tirage"           element={<Tirage />} />
              <Route path="contact"           element={<Contact />} />
              <Route path="service-vip"       element={<ServiceVIP />} />
            </Route>

            {/* ── Auth ── */}
            <Route element={<AuthLayout />}>
              <Route path="connexion"   element={<Login />} />
              <Route path="inscription" element={<Inscription />} />
              <Route path="otp"         element={<OTP />} />
              <Route path="choix-role"  element={<ChoixRole />} />
            </Route>

            {/* ── Client ── */}
            <Route element={<ClientGuard><ClientLayout /></ClientGuard>}>
              <Route path="client">
                <Route index element={<Navigate to="carte" replace />} />
                <Route path="carte"                   element={<ClientCarte />} />
                <Route path="rdv"                    element={<ClientRDV />} />
                <Route path="abonnement"             element={<ClientAbonnement />} />
                <Route path="historique"             element={<ClientHistorique />} />
                <Route path="profil"                 element={<ClientProfil />} />
                <Route path="reserver/:partenaireId" element={<ClientReserver />} />
                <Route path="factures"               element={<ClientFactures />} />
                <Route path="parrainage"             element={<ClientParrainage />} />
                <Route path="fidelite"               element={<ClientFidelite />} />
              </Route>
            </Route>

            {/* ── Partenaire ── */}
            <Route element={<PartenaireGuard><PartenaireLayout /></PartenaireGuard>}>
              <Route path="partenaire">
                <Route index element={<Navigate to="accueil" replace />} />
                <Route path="accueil"        element={<PartAccueil />} />
                <Route path="rdv"            element={<PartRDV />} />
                <Route path="scanner"        element={<PartScanner />} />
                <Route path="portefeuille"   element={<PartPortefeuille />} />
                <Route path="stats"          element={<PartStats />} />
                <Route path="disponibilites" element={<PartDisponibilites />} />
                <Route path="salon"          element={<PartSalon />} />
                <Route path="materiel"       element={<PartMateriel />} />
                <Route path="certificat"     element={<PartCertificat />} />
                <Route path="vacances"       element={<PartVacances />} />
                <Route path="profil"         element={<PartProfil />} />
              </Route>
            </Route>

            {/* ── Employé ── */}
            <Route element={<EmployeGuard><EmployeLayout /></EmployeGuard>}>
              <Route path="employe">
                <Route index element={<Navigate to="accueil" replace />} />
                <Route path="accueil"    element={<EmpAccueil />} />
                <Route path="calendrier" element={<EmpCalendrier />} />
                <Route path="scanner"    element={<EmpScanner />} />
                <Route path="walkin"     element={<EmpWalkin />} />
                <Route path="stats"      element={<EmpStats />} />
                <Route path="conge"        element={<EmpConge />} />
                <Route path="recompenses" element={<EmpRecompenses />} />
              </Route>
            </Route>

            {/* ── Candidat ── */}
            <Route element={<CandidatGuard><CandidatLayout /></CandidatGuard>}>
              <Route path="candidat">
                <Route index element={<Navigate to="statut" replace />} />
                <Route path="statut"          element={<CandStatut />} />
                <Route path="formation"      element={<CandFormation />} />
                <Route path="certificat"     element={<CandCertificat />} />
                <Route path="quiz/:moduleId" element={<CandQuiz />} />
              </Route>
            </Route>

            {/* ── Fournisseur ── */}
            <Route element={<FournisseurGuard><FournisseurLayout /></FournisseurGuard>}>
              <Route path="fournisseur">
                <Route index element={<Navigate to="catalogue" replace />} />
                <Route path="catalogue" element={<FourCatalogue />} />
                <Route path="commandes" element={<FourCommandes />} />
                <Route path="paiements" element={<FourPaiements />} />
              </Route>
            </Route>

            {/* ── Admin ── */}
            <Route element={<AdminGuard><AdminLayout /></AdminGuard>}>
              <Route path="admin">
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard"    element={<AdminDashboard />} />
                <Route path="calendrier"   element={<AdminCalendrier />} />
                <Route path="clients"      element={<AdminClients />} />
                <Route path="employes"     element={<AdminEmployes />} />
                <Route path="partenaires"  element={<AdminPartenaires />} />
                <Route path="candidats"    element={<AdminCandidats />} />
                <Route path="fournisseurs" element={<AdminFournisseurs />} />
                <Route path="services"     element={<AdminServices />} />
                <Route path="produits"     element={<AdminProduits />} />
                <Route path="chaises"      element={<AdminChaises />} />
                <Route path="transactions" element={<AdminTransactions />} />
                <Route path="abonnements"  element={<AdminAbonnements />} />
                <Route path="virements"    element={<AdminVirements />} />
                <Route path="blog"         element={<AdminBlog />} />
                <Route path="sms"          element={<AdminSMS />} />
                <Route path="formation"    element={<AdminFormation />} />
                <Route path="config"       element={<AdminConfig />} />
                <Route path="stats"        element={<AdminStats />} />
                <Route path="migration"    element={<AdminMigration />} />
                <Route path="parametres"   element={<AdminParametres />} />
              </Route>
            </Route>

            {/* ── 404 ── */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
