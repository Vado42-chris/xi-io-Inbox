# xi-io Inbox Portable Deployment Architecture

Status: LOCKED DIRECTION  
Date: 2026-06-24

## Purpose

xi-io Inbox must support multiple deployment shapes without rewriting the app.

Initial deployment may be an embedded module. Future deployment may be a standalone product domain or dedicated hosted service.

## Core rule

The app must not hard-code its public route root.

All routes, assets, API calls, auth callbacks, service-worker scopes, and manifest paths must resolve through a deployment profile.

## Supported deployment shapes

### Local development

- public base path: `/`
- private data local only

### Embedded module

- example public base path: `/inbox/`
- static output deploys to the app subfolder only

### Standalone product domain

- public base path: `/`
- static output deploys to the domain public root

### Future hosted service

- public base path depends on domain/subdomain
- private runtime data lives outside public assets

## Required profile fields

- app ID
- product name
- deployment mode
- public origin
- public base path
- asset base path
- API base path
- public build target
- private data root

## Path resolver requirement

The app should use helpers for:

- app routes
- asset URLs
- API URLs
- auth callback URLs
- service worker scope
- manifest URL

## Safety rules

- Build locally first.
- Verify locally.
- Deploy generated static output only.
- Never develop directly inside a public deploy folder.
- Never deploy private data into public assets.
- Destructive sync must dry-run first.
- Destructive sync must target only the configured app folder.

## Private data boundary

Private email, OAuth tokens, evidence packages, attachments, manifests, account configs, logs, and model-analysis outputs must not be placed under public web folders.

END OF ARCHITECTURE
