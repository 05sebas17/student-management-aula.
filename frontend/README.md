# Frontend Angular

Interfaz de Aula. Consulta el [README principal](../README.md) para iniciar backend y frontend, usar Docker y preparar la entrega.

```powershell
npm.cmd ci
npm.cmd start
npm.cmd run test:ci
npm.cmd run build
```

La página está en `src/app/features/students/pages/`, el formulario en `components/`, los tipos en `models/` y el cliente HTTP en `data-access/`. El backend debe escuchar en 8080; puedes modificar `proxy.conf.json` si necesitas otro puerto. Reinicia Angular después de cambiar el proxy.
