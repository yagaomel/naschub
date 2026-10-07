# NascHUB — Gestão para Corretoras de Seguros

**SaaS single-file, offline-first.** Um único `index.html` (~175 KB), vanilla JS sem framework nem build — drop direto no Netlify.

## Rodar
- **Netlify Drop**: suba esta pasta (ou o zip descompactado). Sem build, sem dependências.
- **Local**: abra `index.html` em qualquer navegador moderno.

## Acesso demo
| Campo | Valor |
|---|---|
| E-mail | `yago@nascor.com.br` |
| Senha | `nascor@23` |
| Auto-login | adicione `?demo=1` à URL (ex.: `index.html?demo=1#/dashboard`) |

Sessão em `sessionStorage` (`nh_auth`); logout volta ao landing como guest.

## Módulos (16)
Dashboard · Leads · Pipeline · Projetos · Apólices · Renovações · Comissões · Clientes · Seguradoras · Documentos · Importações · Radar Comercial · Radar PNCp (Lei 14.133/2021) · Atividades · Agenda · Usuários/RBAC (matriz clicável 16×4)

Mais: landing pública, login, Termos, Privacidade, Cookies, Política LGPD, banner de cookies e crédito **© YNascimento**.

## Destaques
- **Momento Nascimento**: virar PROPOSTA→ATIVA dispara burst radial + partículas + count-up da comissão.
- Count-up híbrido (rAF + fallback por intervalo + backstop) em todos os KPIs.
- LGPD aplicada: arquivamento de cliente com trilha auditável e reversão de 30 dias.
- Adaptadores de integração por seguradora (`MOCK / CSV / MANUAL / API_PARCIAL`) — segredos mascarados, AES-256-GCM no backend.
- Responsivo: ≤1024px sidebar vira icon rail; ≤768px bottom tabs + tabelas viram cards.

## Backend opcional (Netlify Functions)
O front é **offline-first**: sem funções ele roda 100% no navegador (`file://` incluso). Com o deploy no Netlify as funções ativam persistência e auth de rede automaticamente — nenhuma flag.

| Endpoint | Método | Função |
|---|---|---|
| `/api/state` | GET | Carrega snapshot persistido (`{v,ts,data}` via `@netlify/blobs`, zero config de chave) |
| `/api/state` | POST | Salva snapshot novo (incrementa `v`, last-write-wins) |
| `/api/login` | POST | Credenciais demo → token `email:exp:HMAC-SHA256` |
| `/api/login` | GET | Valida token (header `Authorization: Bearer …`) |
| `/api/integrations-test` | POST | Testa adaptador da seguradora (`MOCK/CSV/MANUAL/API_PARCIAL`) — **sempre marcado `simulado:true`** |

**Env:** `NH_SECRET` (opcional; sem ela cai em segredo de dev).
**Dev local:** `npx netlify dev --port 8888` → abra `http://localhost:8888/?demo=1`.
**Semântica v0:** no login remoto-vence (carrega `v` mais alto ao abrir); gravação debounced ~2 s após mudanças; sem funções → modo offline silencioso.

## Reconstrução & testes
Fontes: `part0.html` (head+CSS) + `part1..part7.js` concat → `index.html`.
Smoke funcional: `node smoke.js` (requer `jsdom`; 16 módulos + fluxos críticos, ~80 checks).

© YNascimento — NascHUB 2026
