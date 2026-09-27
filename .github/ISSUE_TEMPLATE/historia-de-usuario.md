---
name: Historia de usuario
about: Una historia de usuario del proyecto con sus escenarios y su checklist ATDD
title: "HUxx - "
labels: ["historia"]
---

## Historia

Como **[rol]** quiero **[funcionalidad]** para **[motivación]**.

**Requisito:** R?
**Estimación:** ? horas/equipo

## Escenarios

### E1 · Válido
- **Given** …
- **When** …
- **Then** …

### E2 · Inválido
- **Given** …
- **When** …
- **Then** …

## Checklist ATDD

- [ ] Pruebas de aceptación escritas y fallando (`test(itNNhXX): ...`)
- [ ] Prueba de integración con mock (si hay dependencia externa)
- [ ] Implementación mínima que pasa las pruebas (`feat(itNNhXX): ...`)
- [ ] Refactorización con todas las pruebas en verde (`refactor(itNNhXX): ...`)
- [ ] PR `ITnn-Hxx` revisada y fusionada en `it-nn`
