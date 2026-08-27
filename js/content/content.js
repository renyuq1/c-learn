/* ============================================================
   课程数据容器 + 内容格式说明

   每个章节文件（ch1.js ~ ch8.js）通过下面的方式追加内容：
     window.COURSE.push({ id, title, icon, intro, chapters, quiz });

   数据格式约定：

   chapter（小节，即左侧目录里的一课）= {
     id, title,
     lesson:  [ block, ... ],              // 讲解内容块
     examples: [ { title, code, note? } ], // 可运行示例
   }

   block 类型（lesson 里的内容块）：
     { t:"p",    x:"段落文字" }              // 支持 `行内代码`
     { t:"h",    x:"小节标题" }
     { t:"code", x:"C代码", out?:"预期输出" }
     { t:"list", x:["条目", ...] }
     { t:"ol",   x:["条目", ...] }
     { t:"tip",  x:"提示文字" }
     { t:"warn", x:"注意事项" }
     { t:"note", x:"补充说明" }
     { t:"table", head:["列1","列2"], rows:[[..],[..]] }

   quiz（本章训练题，三类题型，均带答案与解析）= {
     title,
     choice: [ { q, options:[..], answer: 索引, explain } ],
     fill:   [ { q, answer, accept?:[..], explain } ],   // accept 为可接受的其它答案
     code:   [ {
         title, level:"easy"|"mid"|"hard",
         prompt, starter, hint?,
         answer,          // 参考答案（C 代码）
         explain,         // 解题思路 / 解析
         tests: [ { stdin:"", expected:".." } ]          // 判题用例（按 stdout 比较）
       } ]
   }
   ============================================================ */

window.COURSE = window.COURSE || [];
