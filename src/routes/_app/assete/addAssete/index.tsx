import { AnimationMove } from '@/components/common/animation/move'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from 'antd/es/form/Form'
import { AnimatePresence } from 'framer-motion'
import { AddAsseteFrist } from './-components/addAsseteFrist'
import { AddAsseteSecond } from './-components/addAsseteSecond'
import './index.scss'

export const Route = createFileRoute('/_app/assete/addAssete/')({
  component: RouteComponent
})

function RouteComponent() {
  const [firstForm] = useForm()
  const [secondForm] = useForm()
  const [step, setStep] = useState(0)

  const onFinish = () => {
    switch (step) {
      case 0: {
        setStep(1)
        break
      }
      case 1: {
        //
        break
      }
    }
  }

  const backStep = () => {
    setStep(step - 1)
  }

  const saveDraft = () => {
    localStorage.setItem('draft', JSON.stringify({
      firstForm: firstForm.getFieldsValue(),
      secondForm: secondForm.getFieldsValue()
    }))
  }

  useEffect(() => {
    const draft = localStorage.getItem('draft')
    if (draft) {
      const draftData = JSON.parse(draft)
      firstForm.setFieldsValue(draftData.firstForm)
      secondForm.setFieldsValue(draftData.secondForm)
    }
  }, [])

  const nowStepContent = useMemo(() => {
    switch (step) {
      case 0: {
        return (
          <AnimationMove animKey="addAsseteFrist">
            <AddAsseteFrist form={firstForm} onFinish={onFinish} />
          </AnimationMove>
        )
      }
      case 1: {
        return (
          <AnimationMove animKey="addAsseteSecond">
            <AddAsseteSecond form={secondForm} onFinish={onFinish} backStep={backStep} saveDraft={saveDraft} />
          </AnimationMove>
        )
      }
    }
  }, [step])

  return (
    <div className="addAssete">
      <AnimatePresence mode="wait">
        {nowStepContent}
      </AnimatePresence>

    </div>
  )
}
