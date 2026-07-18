# CodelyFlix 🎬

Plataforma de streaming (estilo Netflix) construída 100% com serviços gratuitos:
**Next.js 14 + Supabase + Vercel/Cloudflare Pages**.

## O que já está pronto nesta entrega

- **Catálogo completo**: filmes, séries, temporadas, episódios
- **Home** com banner, "Continue assistindo", fileiras por categoria
- **Página do filme** com player, sinopse, elenco, direção
- **Página da série** com temporadas e episódios
- **Busca avançada** (nome, texto completo em português)
- **Páginas de categoria** (ação, terror, comédia, etc.)
- **Login** (e-mail/senha, Google, GitHub via Supabase Auth)
- **Minha Lista** (favoritos)
- **Painel Admin** (`/admin`) protegido por login:
  - Dashboard com contadores
  - Cadastrar / editar / excluir filmes
  - Listagem de séries
- **Player de vídeo** com legendas (.vtt) e progresso salvo automaticamente
- **Banco de dados completo** (`supabase/schema.sql`) com RLS configurado
- **API routes**: cadastro de filmes, progresso de visualização, busca

## Como rodar (grátis, do zero)

### 1) Banco de dados — Supabase (grátis)
1. Crie uma conta em https://supabase.com e um novo projeto (plano Free)
2. Vá em **SQL Editor** → cole o conteúdo de `supabase/schema.sql` → Run
3. Vá em **Project Settings → API** e copie:
   - `Project URL`
   - `anon public key`
   - `service_role key` (nunca exponha essa no frontend!)
4. Em **Authentication → Providers**, ative Google e/ou GitHub se quiser login social

### 2) Variáveis de ambiente
```bash
cp .env.local.example .env.local
```
Preencha com as chaves do passo anterior.

### 3) Instalar e rodar localmente
```bash
npm install
npm run dev
```
Acesse http://localhost:3000

### 4) Login e permissão de administrador

A autenticação agora é real (usa `@supabase/ssr`, sessão via cookies, protegida no `middleware.ts`).

1. Rode o projeto e acesse `/login` — cadastre-se com e-mail/senha (ou ative Google/GitHub no passo 7)
2. Ao se cadastrar, um trigger no banco (já incluso no `schema.sql`) cria automaticamente uma
   linha na tabela `profiles` com `role = 'user'`
3. Para virar administrador: no Supabase, vá em **Table Editor → profiles**, ache a linha com
   seu e-mail/nome, e mude o campo `role` de `user` para `admin`
4. Faça logout e login de novo (ou simplesmente recarregue a página) — agora `/admin` deve abrir normalmente

Se tentar acessar `/admin` sem estar logado, você é redirecionado para `/login`.
Se estiver logado mas sem `role = admin`, é redirecionado para a Home.

### 5) Deploy gratuito
- **Vercel** (recomendado p/ Next.js): importe o repositório no https://vercel.com,
  configure as 3 variáveis de ambiente, deploy automático a cada push.
- **Cloudflare Pages**: alternativa gratuita com CDN global.

## Cadastrando conteúdo

1. Vá em `/admin/movies/new` e preencha os dados do filme (título, poster, sinopse etc.) e salve
2. Você é levado automaticamente para a tela de edição do filme, onde tem duas seções extras:
   - **Fontes de vídeo**: cole o link do YouTube (marcado como "Não listado"), Vimeo,
     Supabase Storage ou qualquer URL direta `.mp4`/`.m3u8`. Pode cadastrar mais de
     uma qualidade (480p/720p/1080p) — o player usa a de melhor qualidade disponível
   - **Legendas**: cole a URL de um arquivo `.vtt` (ex: hospedado no Supabase Storage)

Tudo isso já é feito pelo painel visual — não precisa mais mexer direto no Supabase
Table Editor para cadastrar filmes.

## ⚠️ Aviso importante sobre direitos autorais

Este projeto é uma **arquitetura de plataforma**, não um serviço de distribuição
de conteúdo. Se for usar para produção, hospede apenas:
- vídeos próprios,
- conteúdo sob licença aberta,
- incorporações autorizadas (ex.: vídeos públicos do YouTube, respeitando os termos da plataforma).

Distribuir filmes/séries protegidos sem autorização dos detentores dos direitos
não é permitido.

## Próximas etapas (posso continuar quando você quiser)

- CRUD completo de séries/temporadas/episódios no admin (cadastro de vídeo por episódio)
- Gerenciamento de usuários e assinaturas no painel admin
- Upload de imagens/vídeos direto pelo formulário (sem precisar colar link externo)
- Seletor de qualidade manual no player (hoje ele pega a melhor automaticamente)
- Geração de descrições/capas com IA

✅ App mobile (PWA + gerador de APK) — concluído
✅ Cadastro de fontes de vídeo (YouTube/Vimeo/Storage) e legendas pelo painel — concluído
✅ Autenticação real no /admin (sessão via cookies + papel admin) — concluído

Se a resposta for cortada por limite de uso, é só me chamar de novo com
**"continua"** que eu sigo exatamente de onde parou — este README serve
como checklist do que já foi entregue.
