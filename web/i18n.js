/**
 * i18n.js
 * 근로자 온열질환 자가진단 시스템 - 다국어 문구
 * 지원 언어: 한국어(ko), 中文(zh), Русский(ru), Монгол(mn)
 */

const I18N = {
  ko: {
    langName: "한국어",
    appTitle: "세방테크 온열질환 자가진단",
    siteStepTitle: "현장을 선택해주세요",
    siteLabel: "현장명",
    sitePlaceholder: "현장을 선택하세요",
    gpsAutoDetected: "GPS로 현재 위치와 가까운 현장이 자동 선택되었습니다.",
    nameLabel: "이름",
    namePlaceholder: "이름을 입력하세요",
    startBtn: "시작하기",
    hqContactLabel: "본사 비상 연락",
    changeInfoBtn: "현장/이름 변경",
    siteContactLabel: "현장 비상연락",
    checkStepTitle: "현재 느껴지는 증상을 모두 체크해주세요",
    symptoms: {
      none: "없음",
      bodyTempHigh: "평소보다 높은 체온",
      headache: "두통",
      dizziness: "어지러움",
      nausea: "메스꺼움 / 구역질",
      cramps: "근육경련",
      excessiveSweat: "지나치게 많은 땀",
      fatigue: "갑작스러운 피로감",
      severeThirst: "심한 갈증",
      consciousness: "의식저하 / 혼란 (응급)",
      other: "기타"
    },
    otherPlaceholder: "기타 증상을 구체적으로 적어주세요",
    submitBtn: "제출하기",
    submittingBtn: "제출 중...",
    resultTitle: "자가진단 결과",
    level_정상: "정상",
    level_관찰: "관찰",
    level_경고: "경고",
    level_위험: "위험",
    hotlineLabel: "이상증상 발생 시 Hot Line",
    hotlineSmsLabel: "문자 보내기",
    backBtn: "처음으로",
    guides: {
      정상: ["특이사항 없음. 정기적인 수분 섭취와 휴식을 유지하세요."],
      관찰: [
        "작업 강도를 낮추고 자주 수분을 섭취하세요.",
        "증상이 심해지면 다음 자가진단 전이라도 즉시 재응답하세요."
      ],
      경고: [
        "작업을 즉시 중단하고 시원한 장소로 이동해 휴식하세요.",
        "시원한 물을 천천히 마시세요.",
        "증상이 나아지지 않으면 관리자에게 알리거나 Hot Line({hotline})으로 연락하세요."
      ],
      위험: [
        "즉시 작업을 중지하고 시원한 그늘/실내로 이동하세요.",
        "옷을 느슨하게 하고 시원한 물로 몸을 적셔 체온을 낮추세요.",
        "의식이 있으면 물을 조금씩 마시게 하고, 의식이 없거나 저하되면 즉시 119에 신고하세요.",
        "관리자에게 즉시 통보되었습니다. Hot Line: {hotline}"
      ]
    },
    errorGeneric: "오류가 발생했습니다. 다시 시도해주세요.",
    errorRequired: "현장과 이름을 모두 입력해주세요.",
    errorSymptomRequired: "증상 항목을 선택해주세요."
  },
  zh: {
    langName: "中文",
    appTitle: "世邦泰克 温热疾病自我检查",
    siteStepTitle: "请选择现场",
    siteLabel: "现场名称",
    sitePlaceholder: "请选择现场",
    gpsAutoDetected: "已通过GPS自动选择离您最近的现场。",
    nameLabel: "姓名",
    namePlaceholder: "请输入姓名",
    startBtn: "开始",
    hqContactLabel: "总公司紧急联系",
    changeInfoBtn: "更改现场/姓名",
    siteContactLabel: "现场紧急联系",
    checkStepTitle: "请检查一下您现在的所有症状",
    symptoms: {
      none: "无",
      bodyTempHigh: "比平时的体温高",
      headache: "头痛",
      dizziness: "头晕",
      nausea: "恶心 / 想吐",
      cramps: "肌肉痉挛",
      excessiveSweat: "流过多的汗",
      fatigue: "突然的疲劳感",
      severeThirst: "严重口渴",
      consciousness: "意识不清 / 神志不清 (紧急)",
      other: "其他"
    },
    otherPlaceholder: "请具体说明其他症状",
    submitBtn: "提交",
    submittingBtn: "提交中...",
    resultTitle: "自我检查结果",
    level_정상: "正常",
    level_관찰: "观察",
    level_경고: "警告",
    level_위험: "危险",
    hotlineLabel: "出现异常症状时 Hot Line",
    hotlineSmsLabel: "发短信",
    backBtn: "返回首页",
    guides: {
      정상: ["无特殊情况。请保持定期补水和休息。"],
      관찰: [
        "请降低作业强度并经常补充水分。",
        "如果症状加重，请在下次自查前立即重新检测。"
      ],
      경고: [
        "请立即停止作业并前往阴凉处休息。",
        "请缓慢饮用凉水。",
        "如症状未改善，请通知管理者或拨打 Hot Line（{hotline}）。"
      ],
      위험: [
        "请立即停止作业并前往阴凉/室内场所。",
        "请松开衣物，用凉水擦拭身体以降低体温。",
        "如果有意识，请少量多次饮水；如果意识不清或下降，请立即拨打119。",
        "已立即通知管理者。Hot Line：{hotline}"
      ]
    },
    errorGeneric: "发生错误，请重试。",
    errorRequired: "请填写现场和姓名。",
    errorSymptomRequired: "请选择症状项目。"
  },
  ru: {
    langName: "Русский",
    appTitle: "Sebangtec — Самопроверка теплового заболевания",
    siteStepTitle: "Выберите объект",
    siteLabel: "Название объекта",
    sitePlaceholder: "Выберите объект",
    gpsAutoDetected: "Ближайший объект автоматически выбран по GPS.",
    nameLabel: "Имя",
    namePlaceholder: "Введите имя",
    startBtn: "Начать",
    hqContactLabel: "Экстренная связь с головным офисом",
    changeInfoBtn: "Изменить объект/имя",
    siteContactLabel: "Экстренная связь на объекте",
    checkStepTitle: "Отметьте все симптомы, которые вы сейчас ощущаете",
    symptoms: {
      none: "Нет",
      bodyTempHigh: "Температура тела выше обычной",
      headache: "Головная боль",
      dizziness: "Головокружение",
      nausea: "Тошнота",
      cramps: "Мышечные судороги",
      excessiveSweat: "Чрезмерное потоотделение",
      fatigue: "Внезапная усталость",
      severeThirst: "Сильная жажда",
      consciousness: "Спутанность сознания (экстренно)",
      other: "Другое"
    },
    otherPlaceholder: "Опишите другие симптомы",
    submitBtn: "Отправить",
    submittingBtn: "Отправка...",
    resultTitle: "Результат самопроверки",
    level_정상: "Норма",
    level_관찰: "Наблюдение",
    level_경고: "Предупреждение",
    level_위험: "Опасность",
    hotlineLabel: "При появлении симптомов звоните на Hot Line",
    hotlineSmsLabel: "Отправить SMS",
    backBtn: "На главную",
    guides: {
      정상: ["Особых отклонений нет. Регулярно пейте воду и отдыхайте."],
      관찰: [
        "Снизьте интенсивность работы и чаще пейте воду.",
        "Если симптомы усилятся, пройдите повторную проверку немедленно, не дожидаясь следующего раза."
      ],
      경고: [
        "Немедленно прекратите работу и отдохните в прохладном месте.",
        "Медленно пейте прохладную воду.",
        "Если симптомы не проходят, сообщите руководителю или позвоните на Hot Line ({hotline})."
      ],
      위험: [
        "Немедленно прекратите работу и перейдите в тень/помещение.",
        "Ослабьте одежду и охладите тело прохладной водой.",
        "Если человек в сознании, давайте пить небольшими глотками; если сознание нарушено — немедленно звоните 119.",
        "Руководитель уже уведомлён. Hot Line: {hotline}"
      ]
    },
    errorGeneric: "Произошла ошибка. Попробуйте снова.",
    errorRequired: "Укажите объект и имя.",
    errorSymptomRequired: "Выберите симптомы."
  },
  mn: {
    langName: "Монгол",
    appTitle: "Sebangtec — Халуунд өртөх өвчний өөрийн шалгалт",
    siteStepTitle: "Ажлын байрлалаа сонгоно уу",
    siteLabel: "Байрлалын нэр",
    sitePlaceholder: "Байрлал сонгоно уу",
    gpsAutoDetected: "Хамгийн ойрхон байрлал GPS-ээр автоматаар сонгогдлоо.",
    nameLabel: "Нэр",
    namePlaceholder: "Нэрээ оруулна уу",
    startBtn: "Эхлэх",
    hqContactLabel: "Төв компанитай яаралтай холбогдох",
    changeInfoBtn: "Байрлал/нэр солих",
    siteContactLabel: "Байрлалын яаралтай холбоо",
    checkStepTitle: "Одоо мэдэрч буй бүх шинж тэмдгээ тэмдэглэнэ үү",
    symptoms: {
      none: "Байхгүй",
      bodyTempHigh: "Биеийн халуун ердийнөөс өндөр",
      headache: "Толгой өвдөх",
      dizziness: "Толгой эргэх",
      nausea: "Дотор муухайрах",
      cramps: "Булчин таталт",
      excessiveSweat: "Хэт их хөлрөх",
      fatigue: "Гэнэтийн ядрах мэдрэмж",
      severeThirst: "Хүчтэй цангах",
      consciousness: "Ухаан санаа саарах (яаралтай)",
      other: "Бусад"
    },
    otherPlaceholder: "Бусад шинж тэмдгийг дэлгэрэнгүй бичнэ үү",
    submitBtn: "Илгээх",
    submittingBtn: "Илгээж байна...",
    resultTitle: "Өөрийн шалгалтын үр дүн",
    level_정상: "Хэвийн",
    level_관찰: "Ажиглалт",
    level_경고: "Анхааруулга",
    level_위험: "Аюултай",
    hotlineLabel: "Асуудал гарвал Hot Line-руу залгана уу",
    hotlineSmsLabel: "SMS илгээх",
    backBtn: "Эхлэл рүү",
    guides: {
      정상: ["Онцгой шинж тэмдэг алга. Тогтмол ус уож, амарна уу."],
      관찰: [
        "Ажлын хүчийг багасгаж, байнга ус ууна уу.",
        "Шинж тэмдэг хүндэрвэл дараагийн шалгалтыг хүлээлгүй нэн даруй дахин шалгуулна уу."
      ],
      경고: [
        "Ажлыг нэн даруй зогсоож, сэрүүн газарт амарна уу.",
        "Сэрүүн ус аажмаар уугаарай.",
        "Шинж тэмдэг сайжрахгүй бол менежерт мэдэгдэх эсвэл Hot Line ({hotline}) руу залгана уу."
      ],
      위험: [
        "Ажлыг нэн даруй зогсоож, сэрүүн сүүдэр/дотор орчинд шилжинэ үү.",
        "Хувцсаа сулла, биеийг сэрүүн усаар норгож биеийн халууныг бууруулна уу.",
        "Ухаантай бол багаар нь ус уулгаж, ухаан алдсан бол нэн даруй 119 руу залгана уу.",
        "Менежерт нэн даруй мэдэгдсэн. Hot Line: {hotline}"
      ]
    },
    errorGeneric: "Алдаа гарлаа. Дахин оролдоно уу.",
    errorRequired: "Байрлал болон нэрээ оруулна уу.",
    errorSymptomRequired: "Шинж тэмдгээ сонгоно уу."
  }
};

function t(lang, key) {
  return (I18N[lang] && I18N[lang][key]) || I18N.ko[key] || key;
}
