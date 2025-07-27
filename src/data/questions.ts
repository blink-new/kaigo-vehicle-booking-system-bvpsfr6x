import { QuestionStep } from '../types'

export const questionSteps: QuestionStep[] = [
  {
    id: 'care_certification',
    title: '要介護認定を受けていますか？',
    description: '介護保険の要介護認定の有無をお教えください',
    type: 'single',
    options: [
      { value: 'yes', label: '受けている' },
      { value: 'no', label: '受けていない' }
    ],
    required: true
  },
  {
    id: 'care_level',
    title: '要介護度をお選びください',
    description: '認定されている要介護度',
    type: 'single',
    options: [
      { value: '1', label: '要介護1' },
      { value: '2', label: '要介護2' },
      { value: '3', label: '要介護3' },
      { value: '4', label: '要介護4' },
      { value: '5', label: '要介護5' }
    ],
    required: true,
    condition: { care_certification: 'yes' }
  },
  {
    id: 'care_plan',
    title: 'ケアプランに「通院乗降介助」の計画がありますか？',
    description: '担当ケアマネージャーさんが作成したケアプランをご確認ください',
    type: 'single',
    options: [
      { value: 'yes', label: 'ある' },
      { value: 'no', label: 'ない' },
      { value: 'unknown', label: 'わからない' }
    ],
    required: true,
    condition: { care_certification: 'yes' }
  },
  {
    id: 'purpose',
    title: '利用目的をお選びください',
    description: '車両の利用目的を教えてください',
    type: 'single',
    options: [
      { value: 'hospital', label: '通院・診察' },
      { value: 'rehabilitation', label: 'リハビリテーション' },
      { value: 'daycare', label: 'デイサービス' },
      { value: 'shopping', label: '買い物・外出' },
      { value: 'other', label: 'その他' }
    ],
    required: true
  },
  {
    id: 'mobility',
    title: '身体の状況をお教えください',
    description: 'ご利用者様の移動に関する状況',
    type: 'single',
    options: [
      { value: 'walking', label: '歩行可能（介助なし）' },
      { value: 'walking_assist', label: '歩行可能（介助あり）' },
      { value: 'wheelchair', label: '車椅子を使用' },
      { value: 'stretcher', label: 'ストレッチャーが必要' }
    ],
    required: true
  },
  {
    id: 'distance',
    title: '移動距離をお教えください',
    description: '片道の移動距離（概算）',
    type: 'single',
    options: [
      { value: '5', label: '5km以内' },
      { value: '10', label: '5-10km' },
      { value: '20', label: '10-20km' },
      { value: '30', label: '20-30km' },
      { value: '50', label: '30km以上' }
    ],
    required: true
  },
  {
    id: 'area',
    title: 'ご利用エリアをお選びください',
    description: '当サービスは和歌山市内のみ対応しております',
    type: 'single',
    options: [
      { value: 'wakayama-city', label: '和歌山市内' },
      { value: 'other', label: 'その他の地域' }
    ],
    required: true
  },
  {
    id: 'pickup',
    title: 'お迎え場所をお教えください',
    description: '出発地点（和歌山市内）',
    type: 'text',
    required: true
  },
  {
    id: 'destination',
    title: '目的地をお教えください',
    description: '到着地点（和歌山市内）',
    type: 'text',
    required: true
  },
  {
    id: 'date',
    title: 'ご希望日をお選びください',
    description: '利用希望日',
    type: 'date',
    required: true
  },
  {
    id: 'time',
    title: 'ご希望時間をお選びください',
    description: '利用希望時間',
    type: 'single',
    options: [
      { value: '08:00', label: '8:00' },
      { value: '09:00', label: '9:00' },
      { value: '10:00', label: '10:00' },
      { value: '11:00', label: '11:00' },
      { value: '12:00', label: '12:00' },
      { value: '13:00', label: '13:00' },
      { value: '14:00', label: '14:00' },
      { value: '15:00', label: '15:00' },
      { value: '16:00', label: '16:00' },
      { value: '17:00', label: '17:00' }
    ],
    required: true
  }
]