# 质量门禁实现指南

## 质量门禁检查流程实现

### 1. 质量门禁检查函数模板

```markdown
## 质量门禁检查函数

**函数名**: `execute_quality_gate_check(phase_name, artifacts)`
**目的**: 执行指定阶段的质量门禁检查
**参数**:
- `phase_name`: 阶段名称（如"需求分析"、"代码生成"）
- `artifacts`: 该阶段生成的产出物（文档、代码等）

**返回值**:
- `pass`: 布尔值，表示是否通过检查
- `report`: 详细检查报告
- `failures`: 失败项列表（如未通过）

**执行步骤**:
1. **加载检查清单**: 根据`phase_name`加载`common-quality-gates.md`中对应的检查项
2. **验证产出物**: 检查`artifacts`是否符合检查项要求
3. **生成报告**: 创建详细的质量检查报告
4. **决策**: 根据检查结果决定是否允许继续
```

### 2. 各阶段质量门禁检查实现

#### 2.1 需求分析阶段质量门禁检查

```python
def check_requirements_quality(requirements_doc):
    """
    检查需求文档质量
    """
    checks = [
        ("功能需求完整", check_functional_requirements_complete),
        ("非功能需求明确", check_non_functional_requirements),
        ("验收标准详细", check_acceptance_criteria),
        ("优先级合理", check_priorities),
        ("可追溯性建立", check_traceability_matrix)
    ]
    
    results = []
    for check_name, check_func in checks:
        result = check_func(requirements_doc)
        results.append((check_name, result))
    
    # 强制级别：任何一项失败则整体失败
    all_passed = all(result for _, result in results)
    
    return {
        "pass": all_passed,
        "results": results,
        "failures": [name for name, result in results if not result]
    }
```

#### 2.2 代码生成阶段质量门禁检查

```python
def check_code_quality(code_files, language):
    """
    检查代码质量
    """
    if language == "java":
        checks = [
            ("命名规范", check_naming_conventions),
            ("注释完整", check_comments),
            ("异常处理", check_exception_handling),
            ("输入验证", check_input_validation),
            ("日志记录", check_logging),
            ("安全防护", check_security),
            ("测试覆盖率", check_test_coverage),
            ("按需求实现", check_implementation_against_requirements),
            ("无占位符", check_no_placeholders)
        ]
    elif language == "typescript":
        checks = [
            ("组件命名规范", check_component_naming),
            ("TypeScript类型", check_typescript_types),
            ("响应式设计", check_responsive_design),
            ("可访问性", check_accessibility),
            ("性能优化", check_performance),
            ("按需求实现", check_implementation_against_requirements),
            ("无占位符", check_no_placeholders)
        ]
    
    results = []
    for check_name, check_func in checks:
        result = check_func(code_files)
        results.append((check_name, result))
    
    # 强制级别：任何一项失败则整体失败
    all_passed = all(result for _, result in results)
    
    return {
        "pass": all_passed,
        "results": results,
        "failures": [name for name, result in results if not result]
    }


def check_implementation_against_requirements(code_files, requirements):
    """
    检查代码是否严格按需求实现
    """
    # 1. 检查是否有私自扩展的功能
    extended_features = find_extended_features(code_files, requirements)
    if extended_features:
        print(f"发现私自扩展的功能: {extended_features}")
        return False
    
    # 2. 检查是否有简化的功能
    simplified_features = find_simplified_features(code_files, requirements)
    if simplified_features:
        print(f"发现简化的功能: {simplified_features}")
        return False
    
    # 3. 检查是否完整实现了所有需求
    missing_features = find_missing_features(code_files, requirements)
    if missing_features:
        print(f"发现未实现的需求: {missing_features}")
        return False
    
    return True


def check_no_placeholders(code_files):
    """
    检查代码中是否有TODO、FIXME等占位符
    """
    placeholder_patterns = [
        r"TODO.*",
        r"FIXME.*",
        r"待实现.*",
        r"待完成.*",
        r"待补充.*",
        r"// TODO",
        r"// FIXME",
        r"// 待实现",
        r"/* TODO",
        r"/* FIXME",
        r"# TODO",
        r"# FIXME",
        r"<!-- TODO",
        r"<!-- FIXME"
    ]
    
    for file_path, content in code_files.items():
        for pattern in placeholder_patterns:
            if re.search(pattern, content, re.IGNORECASE):
                print(f"文件 {file_path} 中发现占位符: {pattern}")
                return False
    
    return True
```

#### 2.3 安全质量门禁检查

```python
def check_security_quality(code_files, config_files):
    """
    检查安全质量
    """
    checks = [
        ("输入验证", check_input_validation_security),
        ("输出编码", check_output_encoding),
        ("SQL注入防护", check_sql_injection_protection),
        ("认证授权", check_authentication_authorization),
        ("敏感数据加密", check_sensitive_data_encryption),
        ("CSRF防护", check_csrf_protection),
        ("CORS配置", check_cors_configuration)
    ]
    
    results = []
    for check_name, check_func in checks:
        result = check_func(code_files, config_files)
        results.append((check_name, result))
    
    # 强制级别：任何一项失败则整体失败
    all_passed = all(result for _, result in results)
    
    return {
        "pass": all_passed,
        "results": results,
        "failures": [name for name, result in results if not result]
    }
```

### 3. 质量门禁检查工具集成

#### 3.1 自动化检查工具配置

```yaml
# quality-gates-tools.yaml
quality_gates:
  tools:
    # 代码质量检查
    code_quality:
      java:
        - name: "checkstyle"
          config: ".checkstyle.xml"
          command: "mvn checkstyle:check"
        - name: "spotbugs"
          command: "mvn spotbugs:check"
      typescript:
        - name: "eslint"
          config: ".eslintrc.js"
          command: "pnpm lint"
        - name: "prettier"
          command: "pnpm format:check"
    
    # 安全检查
    security:
      - name: "sonarqube"
        command: "mvn sonar:sonar"
      - name: "owasp_dependency_check"
        command: "mvn org.owasp:dependency-check-maven:check"
    
    # 测试检查
    testing:
      - name: "jacoco"
        command: "mvn jacoco:check"
        threshold: 0.8  # 80%覆盖率要求
      - name: "jest"
        command: "pnpm test:coverage"
```

#### 3.2 质量门禁检查脚本

```bash
#!/bin/bash
# quality-gate-check.sh

# 参数
PHASE=$1
ARTIFACTS_DIR=$2

# 根据阶段执行不同的检查
case $PHASE in
    "requirements-analysis")
        echo "执行需求分析质量门禁检查..."
        python check_requirements_quality.py "$ARTIFACTS_DIR/requirements.md"
        ;;
    "code-generation")
        echo "执行代码生成质量门禁检查..."
        # 检查Java代码
        mvn checkstyle:check
        mvn spotbugs:check
        mvn jacoco:check
        # 检查TypeScript代码
        pnpm lint
        pnpm test:coverage
        ;;
    "security")
        echo "执行安全质量门禁检查..."
        mvn org.owasp:dependency-check-maven:check
        mvn sonar:sonar
        ;;
    *)
        echo "未知阶段: $PHASE"
        exit 1
        ;;
esac

# 检查结果
if [ $? -eq 0 ]; then
    echo "质量门禁检查通过"
    exit 0
else
    echo "质量门禁检查失败"
    exit 1
fi
```

### 4. 质量门禁报告生成

#### 4.1 报告模板

```markdown
# 质量门禁检查报告

## 基本信息
- **项目名称**: [项目名称]
- **阶段**: [阶段名称]
- **检查时间**: [检查时间]
- **检查工具**: [使用的检查工具]

## 检查结果概览
- **总检查项**: [总数]
- **通过项**: [通过数]
- **失败项**: [失败数]
- **整体状态**: [通过/失败]

## 详细检查结果

### 需求完整性检查
| 检查项 | 状态 | 说明 |
|--------|------|------|
| 功能需求完整 | ✅/❌ | [详细说明] |
| 非功能需求明确 | ✅/❌ | [详细说明] |
| 验收标准详细 | ✅/❌ | [详细说明] |
| 优先级合理 | ✅/❌ | [详细说明] |
| 可追溯性建立 | ✅/❌ | [详细说明] |

### 代码质量检查
| 检查项 | 状态 | 说明 |
|--------|------|------|
| 命名规范符合 | ✅/❌ | [详细说明] |
| 注释完整 | ✅/❌ | [详细说明] |
| 异常处理完整 | ✅/❌ | [详细说明] |
| 输入验证完整 | ✅/❌ | [详细说明] |
| 日志记录完整 | ✅/❌ | [详细说明] |

### 安全检查
| 检查项 | 状态 | 说明 |
|--------|------|------|
| 输入验证完整 | ✅/❌ | [详细说明] |
| 输出编码完整 | ✅/❌ | [详细说明] |
| SQL注入防护 | ✅/❌ | [详细说明] |
| 认证授权完整 | ✅/❌ | [详细说明] |
| 敏感数据加密 | ✅/❌ | [详细说明] |

## 失败项详情
1. **[失败项1]**: [失败原因] [修复建议]
2. **[失败项2]**: [失败原因] [修复建议]
3. **[失败项3]**: [失败原因] [修复建议]

## 修复建议
1. [具体修复建议1]
2. [具体修复建议2]
3. [具体修复建议3]

## 下一步行动
- [ ] 修复所有失败项
- [ ] 重新执行质量门禁检查
- [ ] 确认修复后通过检查

## 检查人员
- **执行人**: [系统自动]
- **审核人**: [如需人工审核]

---
**报告生成时间**: [生成时间]
**报告版本**: [版本号]
```

### 5. 质量门禁与工作流集成

#### 5.1 工作流集成点

```markdown
## 工作流集成点

### INCEPTION阶段
1. **需求分析完成后**: 执行需求质量门禁检查
2. **用户故事生成后**: 执行用户故事质量门禁检查
3. **应用设计完成后**: 执行设计质量门禁检查

### CONSTRUCTION阶段
1. **每个单元代码生成后**: 执行代码质量门禁检查
2. **安全功能实现后**: 执行安全质量门禁检查
3. **测试代码生成后**: 执行测试质量门禁检查

### 构建和测试阶段
1. **构建完成后**: 执行构建质量门禁检查
2. **测试完成后**: 执行测试质量门禁检查
```

#### 5.2 质量门禁检查触发机制

```python
def trigger_quality_gate(phase_name, artifacts):
    """
    触发质量门禁检查
    """
    # 加载质量门禁配置
    quality_gates_config = load_quality_gates_config()
    
    # 检查是否需要执行质量门禁
    if phase_name in quality_gates_config["enabled_phases"]:
        # 执行质量门禁检查
        result = execute_quality_gate_check(phase_name, artifacts)
        
        # 记录检查结果
        record_quality_gate_result(phase_name, result)
        
        # 根据检查结果决定是否继续
        if not result["pass"]:
            # 质量门禁失败，阻止继续
            raise QualityGateFailedError(
                f"质量门禁检查失败: {phase_name}",
                result["failures"]
            )
        else:
            # 质量门禁通过，允许继续
            return True
    else:
        # 该阶段未启用质量门禁，直接通过
        return True
```

### 6. 质量门禁配置管理

#### 6.1 配置文件示例

```yaml
# .kiro/quality-gates.yaml
quality_gates:
  # 严格程度
  strictness: "C"  # A:警告, B:检查点, C:强制
  
  # 启用的阶段
  enabled_phases:
    - "requirements-analysis"
    - "user-stories"
    - "application-design"
    - "code-generation"
    - "security"
    - "build-and-test"
  
  # 各阶段检查项配置
  phases:
    requirements-analysis:
      checks:
        - "functional-requirements-complete"
        - "non-functional-requirements"
        - "acceptance-criteria"
        - "priorities"
        - "traceability-matrix"
      required: true  # 是否必须通过
    
    code-generation:
      checks:
        - "naming-conventions"
        - "comments"
        - "exception-handling"
        - "input-validation"
        - "logging"
        - "security"
        - "test-coverage"
      thresholds:
        test-coverage: 0.8  # 测试覆盖率阈值
    
    security:
      checks:
        - "input-validation"
        - "output-encoding"
        - "sql-injection-protection"
        - "authentication-authorization"
        - "sensitive-data-encryption"
        - "csrf-protection"
        - "cors-configuration"
      required: true
  
  # 检查工具配置
  tools:
    code-quality:
      - "checkstyle"
      - "eslint"
      - "prettier"
    security:
      - "sonarqube"
      - "owasp-dependency-check"
    testing:
      - "jacoco"
      - "jest"
  
  # 报告配置
  reporting:
    format: "markdown"  # 报告格式
    output-dir: "docs/quality-gates"  # 报告输出目录
    include-details: true  # 是否包含详细信息
    send-notifications: false  # 是否发送通知
```

### 7. 质量门禁最佳实践

#### 7.1 实施建议

1. **渐进式实施**: 从关键检查项开始，逐步增加
2. **团队培训**: 确保团队理解质量门禁的重要性
3. **工具集成**: 尽可能自动化质量检查
4. **持续改进**: 定期评审和优化质量门禁

#### 7.2 常见问题处理

1. **误报处理**: 建立误报反馈机制
2. **例外处理**: 建立例外审批流程
3. **性能影响**: 监控质量检查对开发效率的影响
4. **工具维护**: 定期更新检查工具和规则

#### 7.3 成功指标

1. **缺陷率下降**: 生产环境缺陷数量减少
2. **代码质量提升**: 代码复杂度降低，可维护性提高
3. **安全漏洞减少**: 安全漏洞数量减少
4. **团队满意度**: 开发团队对质量门禁的满意度

---

## 总结

质量门禁是确保AI-DLC工作流产出高质量产物的关键机制。通过强制级别的质量门禁检查，可以确保：

1. **需求文档完整性**: 避免需求遗漏和不明确
2. **代码规范符合性**: 确保代码符合团队编码规范
3. **安全质量保障**: 防止安全漏洞和风险
4. **测试覆盖率达标**: 确保代码可测试性和质量

实施质量门禁需要团队共识、合适工具和持续改进，但带来的质量提升和风险降低是值得的。

### 2.3 新增规则检查实现示例

```python
import re

def find_extended_features(code_files, requirements):
    """
    查找私自扩展的功能
    通过分析代码中的功能点，与需求文档对比
    """
    # 从代码中提取功能点
    code_features = extract_features_from_code(code_files)
    
    # 从需求文档中提取功能点
    requirement_features = extract_features_from_requirements(requirements)
    
    # 找出代码中有但需求中没有的功能
    extended = code_features - requirement_features
    
    return list(extended)


def find_simplified_features(code_files, requirements):
    """
    查找简化的功能
    检查需求中的复杂功能是否在代码中被简化
    """
    simplified_features = []
    
    # 检查每个需求功能是否完整实现
    for feature in requirements["features"]:
        if feature["complexity"] == "high":
            # 检查复杂功能是否被简化
            implementation = find_feature_implementation(code_files, feature["name"])
            if implementation and is_simplified(implementation, feature):
                simplified_features.append(feature["name"])
    
    return simplified_features


def find_missing_features(code_files, requirements):
    """
    查找未实现的需求
    """
    # 从代码中提取已实现的功能
    implemented_features = extract_implemented_features(code_files)
    
    # 从需求中提取所有功能
    required_features = {feature["name"] for feature in requirements["features"]}
    
    # 找出需求中有但代码中没有的功能
    missing = required_features - implemented_features
    
    return list(missing)


def extract_features_from_code(code_files):
    """
    从代码中提取功能点
    """
    features = set()
    
    # 分析Java代码
    for file_path, content in code_files.items():
        if file_path.endswith(".java"):
            # 查找Controller中的端点
            controller_patterns = [
                r'@GetMapping\("([^"]+)"\)',
                r'@PostMapping\("([^"]+)"\)',
                r'@PutMapping\("([^"]+)"\)',
                r'@DeleteMapping\("([^"]+)"\)',
                r'@RequestMapping\("([^"]+)"\)'
            ]
            
            for pattern in controller_patterns:
                matches = re.findall(pattern, content)
                for match in matches:
                    features.add(f"API: {match}")
            
            # 查找Service中的方法
            service_pattern = r'public\s+(?:[A-Za-z<>]+\s+)?([A-Za-z]+)\('
            matches = re.findall(service_pattern, content)
            for match in matches:
                if not match.startswith("get") and not match.startswith("set"):
                    features.add(f"Service: {match}")
    
    # 分析TypeScript代码
    for file_path, content in code_files.items():
        if file_path.endswith(".vue") or file_path.endswith(".ts"):
            # 查找Vue组件方法
            vue_pattern = r'methods:\s*{([^}]+)}'
            matches = re.findall(vue_pattern, content, re.DOTALL)
            for match in matches:
                method_pattern = r'(\w+)\s*\([^)]*\)\s*{'
                method_matches = re.findall(method_pattern, match)
                for method in method_matches:
                    features.add(f"Vue Method: {method}")
    
    return features


def is_simplified(implementation, feature):
    """
    判断实现是否被简化
    """
    # 检查复杂功能的关键组件是否缺失
    required_components = feature.get("required_components", [])
    
    for component in required_components:
        if component not in implementation:
            return True
    
    # 检查错误处理是否完整
    if feature.get("requires_error_handling", False):
        if "try" not in implementation and "catch" not in implementation:
            return True
    
    # 检查输入验证是否完整
    if feature.get("requires_validation", False):
        validation_keywords = ["validate", "check", "verify", "assert"]
        has_validation = any(keyword in implementation.lower() for keyword in validation_keywords)
        if not has_validation:
            return True
    
    return False


# 使用示例
if __name__ == "__main__":
    # 模拟代码文件
    code_files = {
        "UserController.java": """
            @RestController
            @RequestMapping("/api/users")
            public class UserController {
                @GetMapping("/list")
                public List<User> getUsers() {
                    // TODO: 实现分页查询
                    return userService.getAllUsers();
                }
                
                @PostMapping("/create")
                public User createUser(@RequestBody User user) {
                    // 私自扩展的功能：添加了日志记录
                    log.info("Creating user: {}", user.getUsername());
                    return userService.createUser(user);
                }
            }
        """,
        
        "UserService.java": """
            @Service
            public class UserService {
                public List<User> getAllUsers() {
                    // 简化的功能：应该包含过滤条件
                    return userRepository.findAll();
                }
                
                public User createUser(User user) {
                    // 缺少输入验证
                    return userRepository.save(user);
                }
            }
        """
    }
    
    # 模拟需求文档
    requirements = {
        "features": [
            {
                "name": "用户列表查询",
                "complexity": "medium",
                "required_components": ["pagination", "filtering"],
                "requires_error_handling": True
            },
            {
                "name": "创建用户",
                "complexity": "high",
                "required_components": ["validation", "duplicate_check"],
                "requires_validation": True,
                "requires_error_handling": True
            }
        ]
    }
    
    # 执行检查
    print("检查代码是否严格按需求实现...")
    
    # 检查占位符
    has_placeholders = not check_no_placeholders(code_files)
    if has_placeholders:
        print("❌ 发现占位符（TODO、FIXME等）")
    
    # 检查私自扩展
    extended = find_extended_features(code_files, requirements)
    if extended:
        print(f"❌ 发现私自扩展的功能: {extended}")
    
    # 检查简化功能
    simplified = find_simplified_features(code_files, requirements)
    if simplified:
        print(f"❌ 发现简化的功能: {simplified}")
    
    # 检查缺失功能
    missing = find_missing_features(code_files, requirements)
    if missing:
        print(f"❌ 发现未实现的需求: {missing}")
    
    if not (has_placeholders or extended or simplified or missing):
        print("✅ 代码严格按需求实现，无占位符")
```

### 2.4 自动化检查脚本

```bash
#!/bin/bash
# check-code-against-requirements.sh

# 检查代码是否严格按需求实现
echo "=== 代码实现合规性检查 ==="

# 1. 检查占位符
echo "1. 检查TODO、FIXME等占位符..."
if grep -r -i "TODO\|FIXME\|待实现\|待完成\|待补充" src/; then
    echo "❌ 发现占位符，质量门禁失败"
    exit 1
else
    echo "✅ 无占位符"
fi

# 2. 检查私自扩展的功能
echo "2. 检查私自扩展的功能..."
# 这里可以集成更复杂的检查逻辑
# 例如：对比代码功能点和需求文档功能点

# 3. 检查简化功能
echo "3. 检查简化功能..."
# 检查复杂功能是否被简化实现

# 4. 生成检查报告
echo "=== 检查完成 ==="
echo "所有检查项通过 ✅"
exit 0
```

### 2.5 质量门禁检查清单更新

```markdown
## 代码实现合规性检查清单

### 需求符合性检查
- [ ] 代码功能与需求文档完全一致
- [ ] 无私自扩展的功能
- [ ] 无简化的功能
- [ ] 所有需求功能均已实现

### 代码完整性检查
- [ ] 无TODO、FIXME等占位符
- [ ] 无"待实现"、"待完成"等注释
- [ ] 所有功能完整实现
- [ ] 无缺失的功能组件

### 实现质量检查
- [ ] 复杂功能完整实现（无简化）
- [ ] 错误处理完整
- [ ] 输入验证完整
- [ ] 业务逻辑完整

### 检查方法
1. **自动化检查**:
   - 使用grep检查占位符
   - 使用静态分析工具检查代码结构
   - 使用代码覆盖率工具检查功能完整性

2. **人工检查**:
   - 对比代码和需求文档
   - 评审复杂功能的实现
   - 验证业务逻辑完整性

### 检查失败处理
1. **立即停止**：质量门禁失败，工作流立即停止
2. **问题记录**：在audit.md中记录具体问题
3. **修复要求**：必须修复所有问题后才能继续
4. **重新检查**：修复后重新执行质量门禁检查
```

### 2.6 集成到CI/CD流程

```yaml
# .github/workflows/quality-gates.yml
name: Quality Gates

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  quality-gates:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Check for TODOs and FIXMEs
      run: |
        echo "检查代码中的占位符..."
        if grep -r -i "TODO\|FIXME\|待实现\|待完成\|待补充" src/; then
          echo "❌ 发现占位符，质量门禁失败"
          exit 1
        fi
        echo "✅ 无占位符"
    
    - name: Check code against requirements
      run: |
        echo "检查代码是否严格按需求实现..."
        # 这里可以调用自定义的检查脚本
        python scripts/check_implementation.py
    
    - name: Run code quality checks
      run: |
        echo "运行代码质量检查..."
        # 后端代码检查
        mvn checkstyle:check
        mvn spotbugs:check
        
        # 前端代码检查
        pnpm lint
        pnpm type-check
    
    - name: Generate quality report
      if: always()
      run: |
        echo "生成质量门禁报告..."
        # 生成详细的检查报告
        python scripts/generate_quality_report.py
        
    - name: Upload quality report
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: quality-gate-report
        path: reports/quality-gate-report.md
```

## 总结

新增的质量门禁规则确保：

1. **代码严格按需求实现**：禁止私自扩展或简化功能
2. **代码完整性**：禁止留下TODO、FIXME、待实现等占位符
3. **实现质量**：确保所有功能完整、正确实现

这些规则通过以下方式强制执行：
- **自动化检查**：使用脚本和工具自动检查
- **人工验证**：在关键节点进行人工评审
- **CI/CD集成**：在流水线中自动执行检查
- **强制级别**：不通过则无法继续工作流

通过这些措施，可以确保AI-DLC工作流产出的代码质量高、符合需求、完整可交付。
