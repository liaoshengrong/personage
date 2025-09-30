# 简历页面代码优化说明

## 优化目标
- 消除代码重复
- 提高组件可复用性
- 分离数据和视图
- 简化维护

## 优化后的代码结构

```
src/app/resume/
├── page.tsx                 # 主页面组件
├── types.ts                 # TypeScript类型定义
├── data.ts                  # 数据层（所有硬编码数据）
├── Header.tsx               # 头部信息组件
├── SectionHeader.tsx       # 章节标题组件
├── SkillsSection.tsx       # 技能部分组件
├── WorkExperienceCard.tsx  # 工作经历卡片组件
├── EducationCard.tsx       # 教育经历卡片组件
└── ProjectCard.tsx        # 项目卡片组件（原有）
```

## 主要优化点

### 1. 数据与视图分离
- 将所有硬编码数据抽离到 `data.ts` 文件中
- 便于后续维护和更新
- 支持从API或配置文件动态加载

### 2. 组件化重构
- 创建了可复用的 `SectionHeader` 组件，统一所有章节标题样式
- 将头部信息封装为独立的 `Header` 组件
- 为每种内容类型创建专门的卡片组件

### 3. 类型安全
- 在 `types.ts` 中定义了所有数据结构
- 提高了代码的可维护性和类型安全性

### 4. 配置化管理
- 个人信息集中配置在 `personalInfo` 对象中
- 颜色主题可配置，便于统一调整样式

## 使用说明

### 更新个人信息
修改 `page.tsx` 中的 `personalInfo` 对象：

```typescript
const personalInfo = {
  name: '你的名字',
  age: '年龄',
  experience: '工作经验',
  email: '邮箱地址',
  website: '个人网站'
};
```

### 更新技能列表
修改 `data.ts` 中的 `skillsData` 数组。

### 更新工作经历
修改 `data.ts` 中的 `workExperienceData` 数组。

### 更新项目经验
修改 `data.ts` 中的 `projectsData` 数组。

### 更新教育经历
修改 `data.ts` 中的 `educationData` 数组。

## 优点

1. **模块化**: 每个组件职责单一，便于测试和维护
2. **可复用**: SectionHeader等组件可在其他页面复用
3. **类型安全**: TypeScript类型定义提高开发效率
4. **易于扩展**: 新增内容类型时只需添加对应组件和数据
5. **样式统一**: 通过配置管理颜色主题，保持视觉一致性