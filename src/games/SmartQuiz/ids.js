// Stable question ids. A bank that already has `id` keeps it. Banks without ids (src/data/quiz.js) get one made from the
// question text, so re-ordering or inserting questions never moves anyone's saved progress (array positions are NOT used).
export const hashText=s=>{let h=5381;for(const ch of String(s))h=((h<<5)+h+ch.codePointAt(0))>>>0;return h.toString(36)};
export const questionId=q=>q.id||`q-${hashText(q.q??q.question??'')}`;
