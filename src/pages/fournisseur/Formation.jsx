import { useFormationFournisseur } from '@/hooks'
import FormationPage from '@/components/formation/FormationPage'

export default function FournisseurFormation() {
  const { data: modules = [], loading } = useFormationFournisseur()
  return (
    <FormationPage
      titre="Formation Fournisseur"
      modules={modules}
      loading={loading}
      quizPath={(id) => `/fournisseur/quiz/${id}`}
    />
  )
}
