/* 第七章 · 用指针和结构体处理链表 */
window.COURSE.push({
  id: 'ch7',
  title: '用指针和结构体处理链表',
  icon: '🔗',
  intro: '结构体组织数据，动态内存 + 指针构造链表——数据结构的入门。',
  chapters: [
    {
      id: '7-1',
      title: '结构体的定义与使用',
      lesson: [
        { t: 'p', x: '前面学的基本类型只能存单个数据。可现实里「一个学生」有姓名、年龄、成绩等多个属性。**结构体（struct）** 就是把多个不同类型的数据打包成一个整体。' },
        { t: 'h', x: '定义与使用' },
        { t: 'code', x: `#include <stdio.h>

struct Student {        // 定义结构体类型
    char name[20];
    int age;
    double score;
};

int main() {
    struct Student s1 = {"小明", 20, 88.5};   // 声明并初始化
    printf("姓名：%s\\n", s1.name);
    printf("年龄：%d\\n", s1.age);
    printf("成绩：%.1f\\n", s1.score);
    return 0;
}`, out: '姓名：小明\n年龄：20\n成绩：88.5' },
        { t: 'h', x: '访问成员' },
        { t: 'p', x: '用**点号 `.`** 访问结构体成员：`s1.name`、`s1.age`。给成员赋值：`s1.age = 21;`。' },
        { t: 'code', x: `#include <stdio.h>
#include <string.h>

struct Student {
    char name[20];
    int age;
};

int main() {
    struct Student s;
    strcpy(s.name, "小红");   // 字符串赋值要用 strcpy
    s.age = 19;
    printf("%s %d\\n", s.name, s.age);
    return 0;
}`, out: '小红 19' },
        { t: 'warn', x: '结构体里的**字符数组不能直接用 `=` 赋值**（如 `s.name = "小红"` 是错的），要用 `strcpy`。' },
        { t: 'tip', x: '结构体是「自定义的数据类型」，它和 `int`、`double` 一样，可以定义变量、数组、指针。' }
      ],
      examples: [
        { title: '定义一个「点」结构体', code: `#include <stdio.h>

struct Point {
    double x;
    double y;
};

int main() {
    struct Point p = {3.0, 4.0};
    printf("点坐标：(%.1f, %.1f)\\n", p.x, p.y);
    return 0;
}`, note: '结构体可以表示任何「复合数据」。' }
      ],
      exercises: [
        {
          id: 'ex-7-1-1', title: '学生结构体', level: 'easy',
          prompt: '定义一个结构体 `Student`，包含姓名（字符串）和成绩（整数）。读入一个学生的姓名和成绩，输出 `姓名 成绩`。',
          starter: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s;
    // 读入姓名和成绩并输出
    return 0;
}`,
          hint: '`scanf("%s %d", s.name, &s.score);`（字符串不加 `&`），`printf("%s %d\\n", s.name, s.score);`。',
          tests: [{ stdin: 'Tom 88', expected: 'Tom 88' }, { stdin: 'Alice 95', expected: 'Alice 95' }]
        },
        {
          id: 'ex-7-1-2', title: '点结构体', level: 'easy',
          prompt: '定义一个结构体 `Point`（含 `x`、`y`），初始化 `{3, 4}`，打印 `x` 和 `y`（中间一个空格）。',
          starter: `#include <stdio.h>

struct Point {
    int x;
    int y;
};

int main() {
    // 定义并初始化 Point 为 {3, 4}，打印
    return 0;
}`,
          hint: '`struct Point p = {3, 4}; printf("%d %d\\n", p.x, p.y);`。',
          tests: [{ stdin: '', expected: '3 4' }]
        }
      ]
    },
    {
      id: '7-2',
      title: '结构体数组与结构体指针',
      lesson: [
        { t: 'p', x: '结构体可以组成数组，也可以有指向它的指针。这两者是「管理一批对象」的基础。' },
        { t: 'h', x: '结构体数组' },
        { t: 'code', x: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s[3] = {
        {"小明", 85}, {"小红", 92}, {"小刚", 78}
    };
    for (int i = 0; i < 3; i++) {
        printf("%s: %d 分\\n", s[i].name, s[i].score);
    }
    return 0;
}`, out: '小明: 85 分\n小红: 92 分\n小刚: 78 分' },
        { t: 'h', x: '结构体指针' },
        { t: 'p', x: '指向结构体的指针，用**箭头 `->`** 访问成员：`p->name` 等价于 `(*p).name`。' },
        { t: 'code', x: `#include <stdio.h>

struct Student {
    char name[20];
    int age;
};

int main() {
    struct Student s = {"小明", 20};
    struct Student *p = &s;

    printf("%s %d\\n", p->name, p->age);   // 用 -> 访问
    return 0;
}`, out: '小明 20' },
        { t: 'warn', x: '访问结构体成员：**普通变量用 `.`，指针用 `->`**。两者别混用。' },
        { t: 'tip', x: '`->` 就是「先解引用再取成员」的简写，记住 `p->成员` 这套写法即可。' }
      ],
      examples: [
        { title: '遍历结构体数组并找最高分', code: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s[4] = {{"A",80},{"B",95},{"C",70},{"D",88}};
    struct Student *best = &s[0];
    for (int i = 1; i < 4; i++) {
        if (s[i].score > best->score) best = &s[i];
    }
    printf("最高分：%s %d\\n", best->name, best->score);
    return 0;
}`, note: '用结构体指针记录当前最高分的学生。' }
      ],
      exercises: [
        {
          id: 'ex-7-2-1', title: '结构体数组求成绩和', level: 'easy',
          prompt: '有一个 3 名学生的结构体数组，成绩分别是 85、92、78。求出三人成绩之和并输出。',
          starter: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s[3] = {
        {"小明", 85}, {"小红", 92}, {"小刚", 78}
    };
    // 求出三人成绩之和并输出
    return 0;
}`,
          hint: '循环累加 `s[i].score`，85 + 92 + 78 = 255。',
          tests: [{ stdin: '', expected: '255' }]
        },
        {
          id: 'ex-7-2-2', title: '用结构体指针访问成员', level: 'mid',
          prompt: '结构体 `struct Student s = {"小明", 20};`，用结构体指针 `p` 和箭头 `->` 访问成员，输出 `小明 20`。',
          starter: `#include <stdio.h>

struct Student {
    char name[20];
    int age;
};

int main() {
    struct Student s = {"小明", 20};
    // 用结构体指针 p 访问成员并输出
    return 0;
}`,
          hint: '`struct Student *p = &s; printf("%s %d\\n", p->name, p->age);`。',
          tests: [{ stdin: '', expected: '小明 20' }]
        }
      ]
    },
    {
      id: '7-3',
      title: 'typedef、共用体与枚举',
      lesson: [
        { t: 'p', x: '有三个能让代码更简洁、更清晰的工具：`typedef`、共用体 `union`、枚举 `enum`。' },
        { t: 'h', x: 'typedef：给类型起别名' },
        { t: 'p', x: '`typedef 原类型 别名;`。比如 `typedef struct Student Student;` 之后就可以直接用 `Student` 而不用每次写 `struct Student`。' },
        { t: 'code', x: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;          // 直接用 Point 代替 struct

int main() {
    Point p = {1, 2};
    printf("(%d, %d)\\n", p.x, p.y);
    return 0;
}`, out: '(1, 2)' },
        { t: 'h', x: '共用体 union' },
        { t: 'p', x: '`union` 的成员**共享同一块内存**（同一时间只有一个成员有意义），大小等于最大的成员。' },
        { t: 'code', x: `#include <stdio.h>

union Data {
    int i;
    float f;
    char c;
};

int main() {
    union Data d;
    d.i = 65;
    printf("%d\\n", d.i);
    d.c = 'A';        // 覆盖了 i
    printf("%c\\n", d.c);
    return 0;
}`, out: '65\nA' },
        { t: 'h', x: '枚举 enum' },
        { t: 'p', x: '`enum` 给一组整数常量起有意义的名字，默认从 0 开始依次 +1：' },
        { t: 'code', x: `#include <stdio.h>

enum Week { MON = 1, TUE, WED, THU, FRI };

int main() {
    enum Week today = WED;
    printf("%d\\n", today);   // 3
    return 0;
}`, out: '3' },
        { t: 'tip', x: '`enum` 让代码少出现「魔法数字」，用 `MON`、`TUE` 比用 1、2 可读得多。' }
      ],
      examples: [
        { title: '用 typedef 简化结构体使用', code: `#include <stdio.h>

typedef struct {
    char name[20];
    int age;
} Person;

int main() {
    Person p = {"小李", 22};
    printf("%s %d\\n", p.name, p.age);
    return 0;
}`, note: 'typedef 后定义变量更方便。' }
      ],
      exercises: [
        {
          id: 'ex-7-3-1', title: '用 typedef 定义结构体', level: 'easy',
          prompt: '用 `typedef` 把结构体起名为 `Point`（含 `x`、`y`），定义变量 `p = {1, 2}` 并打印。',
          starter: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point;

int main() {
    // 用 Point 定义变量 p = {1, 2} 并打印
    return 0;
}`,
          hint: '`Point p = {1, 2}; printf("%d %d\\n", p.x, p.y);`。',
          tests: [{ stdin: '', expected: '1 2' }]
        },
        {
          id: 'ex-7-3-2', title: '枚举的值', level: 'easy',
          prompt: '枚举 `enum Week { MON = 1, TUE, WED, THU, FRI };`，定义 `today = WED` 并打印它的值。',
          starter: `#include <stdio.h>

enum Week { MON = 1, TUE, WED, THU, FRI };

int main() {
    // 定义 today = WED 并打印它的值
    return 0;
}`,
          hint: '`enum Week today = WED; printf("%d\\n", today);`，WED 的值是 3。',
          tests: [{ stdin: '', expected: '3' }]
        }
      ]
    },
    {
      id: '7-4',
      title: '动态内存分配',
      lesson: [
        { t: 'p', x: '之前的数组长度在写代码时就定死了。但有时你**不知道运行时需要多少内存**（比如用户输入 n 个数），这时要用**动态内存分配**。' },
        { t: 'h', x: 'malloc 与 free' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n;
    printf("输入数组长度：");
    scanf("%d", &n);

    int *a = (int*)malloc(n * sizeof(int));   // 分配 n 个 int 的空间
    if (a == NULL) {
        printf("内存分配失败\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) a[i] = i * i;
    for (int i = 0; i < n; i++) printf("%d ", a[i]);
    printf("\\n");

    free(a);   // 用完了必须释放！
    return 0;
}` },
        { t: 'h', x: '关键点' },
        { t: 'list', x: [
          '`malloc(大小)` 分配一块内存，返回首地址（指针）。',
          '大小 = 元素个数 × 单个大小：`n * sizeof(int)`。',
          '`malloc` 返回 `void*`，要强转成你的类型：`(int*)malloc(...)`。',
          '用完用 `free(指针)` **释放**内存，否则会内存泄漏。'
        ] },
        { t: 'warn', x: '忘了 `free` 会造成**内存泄漏**——内存被占用却没人释放，程序跑久了内存越用越少。动态内存是「借了要还」。' },
        { t: 'note', x: '`calloc` 和 `realloc` 也是常用分配函数：`calloc` 会清零，`realloc` 能改变已分配内存的大小。' }
      ],
      examples: [
        { title: '动态分配一个可变长数组', code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    double *a = (double*)malloc(n * sizeof(double));
    for (int i = 0; i < n; i++) a[i] = (i + 1) * 1.5;
    for (int i = 0; i < n; i++) printf("%.1f ", a[i]);
    printf("\\n");
    free(a);
    return 0;
}`, note: '用 malloc 动态创建数组，用完 free 释放。' }
      ],
      exercises: [
        {
          id: 'ex-7-4-1', title: '动态分配数组并求和', level: 'mid',
          prompt: '读入 `n`（1 ≤ n ≤ 100），用 `malloc` 动态分配一个 int 数组，读入 n 个数后求它们的和并输出，最后 `free` 释放。',
          starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int n;
    // 读入 n，malloc 分配，读入并求和输出，最后 free
    return 0;
}`,
          hint: '`int *a = (int*)malloc(n * sizeof(int));` 分配，循环读入累加，最后 `free(a);`。',
          tests: [{ stdin: '5\n1 2 3 4 5', expected: '15' }, { stdin: '3\n10 20 30', expected: '60' }]
        },
        {
          id: 'ex-7-4-2', title: '动态分配并逆序输出', level: 'mid',
          prompt: '读入 `n`（1 ≤ n ≤ 100），用 `malloc` 分配数组并读入 n 个数，**逆序**输出它们，最后 `free`。',
          starter: `#include <stdio.h>
#include <stdlib.h>
int main() {
    int n;
    // 读入 n，malloc 分配，读入后逆序输出，最后 free
    return 0;
}`,
          hint: '分配后循环读入，再 `for (int i = n - 1; i >= 0; i--) printf("%d ", a[i]);`，最后 `free(a);`。',
          tests: [{ stdin: '3\n10 20 30', expected: '30 20 10' }, { stdin: '4\n1 2 3 4', expected: '4 3 2 1' }]
        }
      ]
    },
    {
      id: '7-5',
      title: '链表的概念与建立',
      lesson: [
        { t: 'p', x: '数组虽然好用，但**插入和删除元素很麻烦**（要移动一大片数据）。**链表**用「每个节点存数据 + 指向下一个节点的指针」的方式，让插入删除变得轻松。' },
        { t: 'h', x: '链表的节点' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;              // 存的数据
    struct Node *next;     // 指向下一个节点的指针
} Node;

int main() {
    // 手动造三个节点连成一条链
    Node *a = (Node*)malloc(sizeof(Node));
    Node *b = (Node*)malloc(sizeof(Node));
    Node *c = (Node*)malloc(sizeof(Node));

    a->data = 10; a->next = b;
    b->data = 20; b->next = c;
    c->data = 30; c->next = NULL;   // 末尾指向 NULL

    // 遍历链表
    for (Node *p = a; p != NULL; p = p->next) {
        printf("%d ", p->data);
    }
    printf("\\n");
    return 0;
}`, out: '10 20 30' },
        { t: 'h', x: '链表的结构' },
        { t: 'list', x: [
          '每个**节点**：一个数据域 `data` + 一个指针域 `next`。',
          '**头指针** `head`：指向第一个节点。',
          '最后一个节点的 `next` 指向 `NULL`，表示结束。',
          '遍历：`for (p = head; p != NULL; p = p->next)`。'
        ] },
        { t: 'tip', x: '对比记忆：数组是「一整块连续空间、按下标访问」，链表是「一个个独立节点、用指针串起来」。' }
      ],
      examples: [
        { title: '从输入建链表并求和', code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    Node *head = NULL, *tail = NULL;
    int n, x;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        Node *p = (Node*)malloc(sizeof(Node));
        p->data = x; p->next = NULL;
        if (head == NULL) head = tail = p;
        else { tail->next = p; tail = p; }
    }
    int sum = 0;
    for (Node *p = head; p != NULL; p = p->next) sum += p->data;
    printf("%d\\n", sum);
    return 0;
}`, note: '尾插法建链表：新节点接到末尾，tail 始终指向最后。' }
      ],
      exercises: [
        {
          id: 'ex-7-5-1', title: '建立链表并求和', level: 'mid',
          prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用**尾插法**建立链表，再遍历链表求出所有元素之和并输出。',
          starter: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    int n, x;
    Node *head = NULL, *tail = NULL;
    // 读入 n 和 n 个数，尾插法建链表，遍历求和输出
    return 0;
}`,
          hint: '新建节点接到末尾（`tail->next = p; tail = p;`），再 `for (Node *p = head; p != NULL; p = p->next) sum += p->data;`。',
          tests: [{ stdin: '5\n1 2 3 4 5', expected: '15' }, { stdin: '3\n10 20 30', expected: '60' }]
        },
        {
          id: 'ex-7-5-2', title: '建立链表并遍历输出', level: 'hard',
          prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用**尾插法**建立链表，然后按顺序遍历输出所有元素（每个后面一个空格）。',
          starter: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    int n, x;
    Node *head = NULL, *tail = NULL;
    // 读入 n 和 n 个数，尾插法建链表，按顺序遍历输出
    return 0;
}`,
          hint: '建好链表后 `for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->data);`，最后 `printf("\\n");`。',
          tests: [{ stdin: '3\n10 20 30', expected: '10 20 30' }, { stdin: '4\n1 2 3 4', expected: '1 2 3 4' }]
        }
      ]
    },
    {
      id: '7-6',
      title: '链表的插入、删除与遍历',
      lesson: [
        { t: 'p', x: '链表最大的优势就在插入和删除——**不需要移动其它元素**，只要改几个指针的指向即可。' },
        { t: 'h', x: '在头部插入节点' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

// 在链表头部插入值为 x 的新节点，返回新头指针
Node* insertHead(Node *head, int x) {
    Node *p = (Node*)malloc(sizeof(Node));
    p->data = x;
    p->next = head;    // 新节点指向原来的头
    return p;          // 新节点成为新头
}

int main() {
    Node *head = NULL;
    head = insertHead(head, 30);
    head = insertHead(head, 20);
    head = insertHead(head, 10);   // 结果是 10 20 30

    for (Node *p = head; p != NULL; p = p->next) {
        printf("%d ", p->data);
    }
    printf("\\n");
    return 0;
}`, out: '10 20 30' },
        { t: 'h', x: '删除节点' },
        { t: 'p', x: '删除某个节点，就是把它**前一个节点的 `next` 指向它的后一个节点**，再 `free` 掉它。' },
        { t: 'code', x: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

// 删除值为 x 的第一个节点，返回新头指针
Node* deleteNode(Node *head, int x) {
    Node *cur = head, *prev = NULL;
    while (cur != NULL && cur->data != x) {
        prev = cur;
        cur = cur->next;
    }
    if (cur == NULL) return head;    // 没找到
    if (prev == NULL) head = cur->next;   // 删的是头节点
    else prev->next = cur->next;
    free(cur);
    return head;
}

int main() {
    Node *head = NULL;
    int vals[] = {10, 20, 30};
    for (int i = 0; i < 3; i++) {
        Node *p = (Node*)malloc(sizeof(Node));
        p->data = vals[i]; p->next = head; head = p;
    }
    head = deleteNode(head, 20);
    for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->data);
    printf("\\n");
    return 0;
}`, out: '30 10' },
        { t: 'warn', x: '删除节点后一定要 `free`，否则那块内存永远占着（内存泄漏）。' },
        { t: 'tip', x: '链表操作的关键是**改对指针**：先在纸上画出节点和箭头，再写代码，会清晰很多。' }
      ],
      examples: [
        { title: '链表头插法建表并逆序输出', code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    Node *head = NULL;
    int n, x;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        Node *p = (Node*)malloc(sizeof(Node));
        p->data = x; p->next = head; head = p;   // 头插
    }
    for (Node *p = head; p != NULL; p = p->next) printf("%d ", p->data);
    printf("\\n");
    return 0;
}`, note: '头插法会让插入顺序反过来，所以遍历就是逆序。' }
      ],
      exercises: [
        {
          id: 'ex-7-6-1', title: '头插法建表并输出', level: 'mid',
          prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用**头插法**建立链表，然后遍历输出所有元素（观察顺序会反过来）。',
          starter: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    int n, x;
    Node *head = NULL;
    // 读入 n 和 n 个数，头插法建链表，再遍历输出
    return 0;
}`,
          hint: '头插：`p->next = head; head = p;`，插入顺序会反过来。',
          tests: [{ stdin: '3\n10 20 30', expected: '30 20 10' }, { stdin: '4\n1 2 3 4', expected: '4 3 2 1' }]
        },
        {
          id: 'ex-7-6-2', title: '删除链表中的节点', level: 'hard',
          prompt: '下面的代码先用头插法造出链表 `30 -> 20 -> 10`。请删除值为 `20` 的节点，然后遍历输出剩余节点。',
          starter: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    Node *head = NULL;
    int vals[] = {10, 20, 30};
    for (int i = 0; i < 3; i++) {
        Node *p = (Node*)malloc(sizeof(Node));
        p->data = vals[i]; p->next = head; head = p;
    }
    // 在这里删除值为 20 的节点，并遍历输出剩余节点
    return 0;
}`,
          hint: '用 `prev` 记录前一个节点，找到值为 20 的节点后，把 `prev->next` 指向它的 `next`，再 `free` 它；结果是 30 10。',
          tests: [{ stdin: '', expected: '30 10' }]
        }
      ]
    }
  ],
  quiz: {
    title: '第七章 · 训练题',
    choice: [
      { q: '访问结构体**变量**的成员，用哪个运算符？', options: ['`->`', '`.`', '`&`', '`*`'], answer: 1, explain: '结构体变量用 `.` 访问成员。' },
      { q: '访问结构体**指针**指向的成员，用哪个运算符？', options: ['`.`', '`->`', '`&`', '`::`'], answer: 1, explain: '结构体指针用 `->` 访问成员。' },
      { q: '动态分配 `n` 个 int 的内存，正确写法是？', options: ['`malloc(n)`', '`malloc(n * sizeof(int))`', '`new int[n]`', '`alloc(n)`'], answer: 1, explain: '大小 = n × sizeof(int)，`malloc(n * sizeof(int))`。' },
      { q: '释放用 `malloc` 分配的内存，用哪个函数？', options: ['`delete`', '`free`', '`release`', '`clear`'], answer: 1, explain: '用 `free(指针)` 释放动态内存。' },
      { q: '链表中，最后一个节点的 `next` 指针通常指向？', options: ['第一个节点', '自己', '`NULL`', '随机地址'], answer: 2, explain: '末尾节点的 next 指向 NULL，表示链表结束。' },
      { q: '`union`（共用体）的成员有什么特点？', options: ['各占独立内存', '共享同一块内存', '不能有多个成员', '必须同类型'], answer: 1, explain: 'union 的所有成员共享同一块内存。' }
    ],
    fill: [
      { q: '定义结构体的关键字是 `____`。', answer: 'struct', explain: '用 `struct` 定义结构体类型。' },
      { q: '给类型起别名的关键字是 `____`。', answer: 'typedef', explain: '`typedef` 给已有类型起别名。' },
      { q: '动态分配内存用的函数是 `____`。', answer: 'malloc', explain: '`malloc` 在 stdlib.h 中，动态分配内存。' }
    ],
    code: [
      {
        title: '学生结构体', level: 'easy',
        prompt: '定义一个结构体，包含姓名（字符串）和成绩（整数）。读入一个学生的姓名和成绩，输出 `姓名 成绩`（中间一个空格）。',
        starter: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s;
    // 读入姓名和成绩并输出
    return 0;
}`,
        answer: `#include <stdio.h>

struct Student {
    char name[20];
    int score;
};

int main() {
    struct Student s;
    scanf("%s %d", s.name, &s.score);
    printf("%s %d\\n", s.name, s.score);
    return 0;
}`,
        explain: '读入字符串用 %s（不用 &），读整数用 %d（要 &），再打印成员。',
        tests: [{ stdin: 'Tom 88', expected: 'Tom 88' }, { stdin: 'Alice 95', expected: 'Alice 95' }]
      },
      {
        title: '结构体数组求平均分', level: 'mid',
        prompt: '读入 `n`（1 ≤ n ≤ 50）和 n 个学生的成绩（整数），用结构体数组存储，输出平均分（保留 1 位小数）。',
        starter: `#include <stdio.h>

struct Student { int score; };

int main() {
    int n;
    struct Student s[50];
    // 读入成绩，求平均分输出（%.1f）
    return 0;
}`,
        answer: `#include <stdio.h>

struct Student { int score; };

int main() {
    int n;
    struct Student s[50];
    scanf("%d", &n);
    int sum = 0;
    for (int i = 0; i < n; i++) {
        scanf("%d", &s[i].score);
        sum += s[i].score;
    }
    printf("%.1f\\n", sum / (double)n);
    return 0;
}`,
        explain: '循环读入每个成绩到结构体数组，累加后除以 n（转 double）得平均分。',
        tests: [{ stdin: '3\n80 90 100', expected: '90.0' }, { stdin: '2\n75 80', expected: '77.5' }]
      },
      {
        title: '建立链表并求和', level: 'hard',
        prompt: '读入 `n`（1 ≤ n ≤ 100）和 n 个整数，用**链表**依次存储它们，然后遍历链表求出所有元素的和并输出。',
        starter: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    int n, x;
    Node *head = NULL, *tail = NULL;
    // 建链表，遍历求和输出
    return 0;
}`,
        answer: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node { int data; struct Node *next; } Node;

int main() {
    int n, x;
    Node *head = NULL, *tail = NULL;
    scanf("%d", &n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &x);
        Node *p = (Node*)malloc(sizeof(Node));
        p->data = x; p->next = NULL;
        if (head == NULL) head = tail = p;
        else { tail->next = p; tail = p; }
    }
    int sum = 0;
    for (Node *p = head; p != NULL; p = p->next) sum += p->data;
    printf("%d\\n", sum);
    return 0;
}`,
        explain: '尾插法建链表（新节点接到末尾），再从头遍历累加每个节点的 data。',
        tests: [{ stdin: '5\n1 2 3 4 5', expected: '15' }, { stdin: '3\n10 20 30', expected: '60' }]
      }
    ]
  }
});
