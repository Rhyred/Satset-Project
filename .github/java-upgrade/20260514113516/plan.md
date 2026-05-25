# Upgrade Plan: Satset-Project (20260514113516)

- **Generated**: 2026-05-14 11:57:00
- **HEAD Branch**: entity
- **HEAD Commit ID**: N/A

## Available Tools

**JDKs**
- Java 1.8.0_481: C:\Program Files\Java\jre1.8.0_481 (current environment only; not suitable for project baseline or target runtime)
- JDK 17: **<TO_BE_INSTALLED>** (required by Step 2 baseline verification for current project Java 17 compatibility)
- JDK 21: **<TO_BE_INSTALLED>** (required by upgrade goal)

**Build Tools**
- Maven Wrapper: 3.9.15 (current version; compatible with Java 21)

## Guidelines

> Note: You can add any specific guidelines or constraints for the upgrade process here if needed, bullet points are preferred.

## Options

- Working branch: appmod/java-upgrade-20260514113516
- Run tests before and after the upgrade: true

## Upgrade Goals

- Upgrade Java runtime to latest LTS: Java 21

## Technology Stack

| Technology/Dependency    | Current | Min Compatible | Why Incompatible |
| ------------------------ | ------- | -------------- | ---------------------------------------------- |
| Java                     | 17      | 21             | User-requested runtime upgrade                  |
| Spring Boot              | 3.2.5   | 3.2.5          | Current version already supports Java 21        |
| Maven Wrapper            | 3.9.15  | 3.9.0          | Maven wrapper is already compatible with Java 21 |
| lombok                   | 1.18.x  | 1.18.x         | No upgrade required for Java 21                 |

## Derived Upgrades

- No Spring Boot version upgrade is required because Spring Boot 3.2.5 already supports Java 21.
- No dependency version changes are required beyond the runtime version property update.
- The only derived change is the `java.version` build property to target Java 21.

## Impact Analysis

### Dependency Changes

| File | Dependency | Current | Action | Target | Reason |
|------|-----------|---------|--------|--------|--------|
| pom.xml | java.version | 17 | upgrade | 21 | User-requested runtime upgrade to latest LTS |

### Source Code Changes

| File | Location | Current | Required Change | Reason |
|------|----------|---------|----------------|--------|
| N/A | N/A | N/A | No source code changes required | Existing Spring Boot 3.2.5 application code is compatible with Java 21 |

### Configuration Changes

| File | Property/Setting | Current | Required Change | Reason |
|------|------------------|---------|----------------|--------|
| N/A | N/A | N/A | No application or config property changes detected | Runtime upgrade only |

### CI/CD Changes

| File | Location | Current | Required Change |
|------|----------|---------|----------------|
| N/A | N/A | N/A | No CI/CD files detected requiring Java version updates |

### Risks & Warnings

- **Local environment mismatch**: The current environment only exposes Java 8, while the project requires Java 17 for baseline and Java 21 for the upgrade. **Mitigation**: Install JDK 17 and JDK 21 in Step 1 and run baseline and upgrade verification with those JDKs explicitly.
- **Wrapper `mvnw` default runtime**: `mvnw` currently resolves to Java 8. **Mitigation**: Use explicit `JAVA_HOME` for JDK 17 and JDK 21 during verification steps.
- **Implicit runtime compatibility risks**: No direct incompatible API usage was found in source search, but full test execution on Java 21 is required to catch any hidden runtime issues.

## Upgrade Steps

- Step 1: Setup Environment
  - **Rationale**: The current environment only has Java 8 and the project build requires JDK 17 baseline plus JDK 21 target verification.
  - **Changes to Make**: Install JDK 17 and JDK 21 if missing, verify `JAVA_HOME` and `mvnw` output.
  - **Verification**: `java -version` for both installed JDKs and `.\mvnw.cmd -v` under each `JAVA_HOME`

- Step 2: Setup Baseline
  - **Rationale**: Establish current compilation and test behavior on the project's existing Java 17 target before making changes.
  - **Changes to Make**: Use JDK 17 to run the current Maven build and test commands.
  - **Verification**: `set JAVA_HOME=<JDK17_PATH> && .\mvnw.cmd clean compile test-compile -q && .\mvnw.cmd clean test -q`

- Step 3: Apply Java 21 Runtime Upgrade
  - **Rationale**: Update the project runtime target to Java 21 while preserving compatibility with the existing Spring Boot stack.
  - **Changes to Make**: Update `pom.xml` `java.version` from `17` to `21`.
  - **Verification**: `set JAVA_HOME=<JDK21_PATH> && .\mvnw.cmd clean compile test-compile -q`

- Step 4: Final Validation
  - **Rationale**: Confirm the upgraded runtime is fully supported and all tests pass under Java 21.
  - **Changes to Make**: No additional code changes unless test failures reveal compatibility issues.
  - **Verification**: `set JAVA_HOME=<JDK21_PATH> && .\mvnw.cmd clean test -q`
