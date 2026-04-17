import { useFormationPartenaire } from '@/hooks'
import FormationPage from '@/components/formation/FormationPage'

export default function PartenaireFormation() {
  const { data: modules = [], loading } = useFormationPartenaire()
  return (
    <FormationPage
      titre="Formation Partenaire"
      modules={modules}
      loading={loading}
      quizPath={(id) => `/partenaire/quiz/${id}`}
    />
  )
}
