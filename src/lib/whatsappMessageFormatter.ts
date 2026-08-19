import {
  CentralReport,
  CentralPayment,
  StudentCertificate,
  MonthlyStudentEvaluation,
  CombinedAdminStudent
} from "../types";

export class WhatsAppMessageFormatter {
  /**
   * Formats a lesson report for WhatsApp (Private to Parent OR Group Announcement)
   */
  static formatLessonReport(
    report: CentralReport,
    destination: "private" | "group",
    student?: CombinedAdminStudent | null
  ): string {
    const studentName = report.studentName || student?.name || "الطالب المتميز";
    const subject = report.subject || "القرآن الكريم والتجويد";
    const teacherName = report.teacherName || "هيئة التدريس المعتمدة";
    const date = report.date || new Date().toISOString().split("T")[0];

    const attendanceText =
      report.attendanceStatus === "present"
        ? "✅ *حاضر في الموعد المحدد*"
        : "❌ *غائب / اعتذر مسبقاً*";

    const homeworkRatingText =
      report.homeworkRating === "excellent"
        ? "⭐⭐⭐⭐⭐ *ممتاز (10 من 10)*"
        : report.homeworkRating === "good"
        ? "⭐⭐⭐⭐ *جيد جداً (8 من 10)*"
        : "⚠️ *يحتاج إلى مزيد من التدريب والمراجعة*";

    if (destination === "group") {
      // Group Announcement format (celebratory, motivating, privacy-conscious)
      return `✨ *أكاديمية GoStars التعليمية* ✨
━━━━━━━━━━━━━━━━━━━━
🌟 *تقرير حصة دراسية جديدة* 🌟
👥 *المجموعة:* ${report.groupName || "المجموعة الدراسية"}
📚 *المادة:* ${subject}
👨‍🏫 *المعلم:* ${teacherName}
📅 *التاريخ:* ${date}

👤 *اسم الطالب:* ${studentName}
${attendanceText}
${report.memorizationProgress ? `📖 *ما تم إنجازه في الحصة:* ${report.memorizationProgress}` : ""}
🎯 *تقييم الواجب والمشاركة:* ${homeworkRatingText}

💬 *ملاحظة المعلم:*
${report.teacherNotes || report.notes || "أداء ممتاز وتفاعل طيب ومشاركة رائعة."}
━━━━━━━━━━━━━━━━━━━━
🎓 *أكاديمية GoStars التعليمية* • معاً نحو التميز والتفوق`;
    }

    // Private Parent Message (Full details, portal link, strict isolation)
    return `✨ *أكاديمية GoStars التعليمية* ✨
━━━━━━━━━━━━━━━━━━━━
📋 *تقرير أداء الطالب في الحصة الدراسية*
👤 *اسم الطالب:* *${studentName}*
📚 *المادة:* ${subject}
👨‍🏫 *المعلم:* ${teacherName}
📅 *تاريخ الحصة:* ${date}
━━━━━━━━━━━━━━━━━━━━
📌 *تفاصيل الحصة:*
• *الحضور:* ${attendanceText}
• *حل الواجب:* ${homeworkRatingText}
${report.memorizationProgress ? `• *الحفظ والمراجعة:* ${report.memorizationProgress}\n` : ""}${report.tajweedLevel ? `• *مستوى التجويد والقراءة:* ${report.tajweedLevel}\n` : ""}
📝 *ملاحظات المعلم:*
${report.teacherNotes || report.notes || "أداء ممتاز واستيعاب طيب وتفاعل ممتاز خلال الحصة."}

${report.strengths ? `🌟 *نقاط القوة:* ${report.strengths}\n` : ""}${report.recommendations ? `💡 *توجيهات للمراجعة:* ${report.recommendations}\n` : ""}
━━━━━━━━━━━━━━━━━━━━
📱 *لمتابعة سجل الحصص والشهادات عبر بوابة ولي الأمر:*
🌐 https://gostars-academy.edu/#portal

شاكرين لكم حسن تعاونكم واهتمامكم الكريم 🌸`;
  }

  /**
   * Formats a financial payment receipt voucher (Rule 13 strictly prepaid compliant)
   */
  static formatPaymentReceipt(
    payment: CentralPayment,
    remainingLessons: number = 8,
    studentName?: string
  ): string {
    const name = studentName || payment.studentName || "ولي الأمر الكريم";
    const amount = payment.amount || 0;
    const date = payment.date || new Date().toISOString().split("T")[0];
    const receiptNum = payment.receiptNumber || `GS-PAY-${Math.floor(1000 + Math.random() * 9000)}`;

    return `✨ *أكاديمية GoStars التعليمية* ✨
━━━━━━━━━━━━━━━━━━━━
🧾 *إيصال استلام وتأكيد الدفع*
👤 *اسم الطالب / ولي الأمر:* *${name}*
🔢 *رقم الإيصال:* \`${receiptNum}\`
📅 *تاريخ الدفع:* ${date}
━━━━━━━━━━━━━━━━━━━━
💰 *المبلغ المدفوع:* *${amount} جنيه / ريال*
💳 *طريقة الدفع:* ${payment.paymentMethod || "تحويل إلكتروني"}
🎯 *عدد الحصص المضافة للحساب:* ${payment.lessonsCovered || payment.lessonsCount || 8} حصص
⏳ *إجمالي رصيد الحصص المتبقية:* *${remainingLessons} حصة*
━━━━━━━━━━━━━━━━━━━━
✅ تم تسجيل الدفع وإضافة الحصص إلى حساب الطالب بنجاح.
🌐 يمكنكم مراجعة كشف الحساب في أي وقت عبر بوابة ولي الأمر.

شكراً جزيلاً لثقتكم وتعاونكم الدائم معنا 🌟`;
  }

  /**
   * Formats an official certificate announcement
   */
  static formatCertificateAward(cert: StudentCertificate): string {
    return `🎉 *تهنئة وتكريم من أكاديمية GoStars التعليمية* 🎉
━━━━━━━━━━━━━━━━━━━━
🏆 *شهادة تقدير وتفوق* 🏆

يسر إدارة الأكاديمية ومعلميها تهنئة الطالب المتفوق:
🌟 *${cert.studentName}* 🌟

بمناسبة الحصول على:
📜 *${cert.title}*
📚 *المادة / المسار:* ${cert.trackOrSubject}
🔢 *رقم الشهادة:* \`${cert.serialNumber}\`
📅 *تاريخ الإصدار:* ${cert.issueDate}

🎖️ *كلمة التقدير:*
«${cert.appreciationText}»

${cert.gradeBadge ? `✨ *التقدير:* *${cert.gradeBadge}*\n` : ""}
━━━━━━━━━━━━━━━━━━━━
مع أطيب تمنياتنا بدوام النجاح والتفوق دائماً 🌸
🌐 أكاديمية GoStars التعليمية • https://gostars-academy.edu`;
  }

  /**
   * Formats a monthly comprehensive evaluation report
   */
  static formatMonthlyEvaluation(
    evaluation: MonthlyStudentEvaluation,
    studentName: string
  ): string {
    return `✨ *أكاديمية GoStars التعليمية* ✨
━━━━━━━━━━━━━━━━━━━━
📊 *التقرير الشهري لمتابعة أداء الطالب (${evaluation.monthLabel})*
👤 *اسم الطالب:* *${studentName}*
🎖️ *التقييم العام:* *${evaluation.generalRating}*
━━━━━━━━━━━━━━━━━━━━
📈 *ملخص الشهر:*
• 📅 *نسبة الحضور والالتزام:* ${evaluation.attendanceRate}%
• 📝 *نسبة حل الواجبات والتسميع:* ${evaluation.homeworkRate}%
• 🎯 *متوسط درجات الاختبارات:* ${evaluation.averageScore}%

${evaluation.memorizationProgress ? `📖 *ما تم حفظه ومراجعته:* ${evaluation.memorizationProgress}\n` : ""}${evaluation.teacherNotes ? `💬 *رأي وتوجيهات المعلم:*\n${evaluation.teacherNotes}\n` : ""}
━━━━━━━━━━━━━━━━━━━━
📱 لعرض التقرير الكامل والشهادات، يرجى زيارة بوابة ولي الأمر:
🌐 https://gostars-academy.edu/#portal`;
  }
}
