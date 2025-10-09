# Design4Public 메인사이트 API 가이드

## 1. 개요

이 문서는 Design4Public의 메인 웹사이트 (`www.design4public.com`) 구축을 위해 필요한 API 사용 방법을 안내합니다. 메인 웹사이트는 CMS에 등록된 데이터를 조회하여 보여주는 역할만 수행하며, 별도의 회원가입이나 로그인 기능은 없습니다.

API는 Supabase에서 제공하는 RESTful API를 직접 사용하며, `anon` 키를 이용해 안전하게 데이터에 접근할 수 있습니다.

## 2. 인증 및 기본 정보

모든 API 요청에는 인증을 위한 API 키가 필요합니다. 또한, 모든 요청의 기본 URL은 다음과 같습니다.

- **Base URL**: `https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/`
- **API Key (`anon key`)**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dXVkYnhoZmZuYnpqeGdxYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NjQ3MDAsImV4cCI6MjA3MjU0MDcwMH0.WVWlZ2-KZBu1fSHz9u8o7ymbMrLS4G2cglquzcFMZDs`

### 요청 헤더 설정

모든 요청의 헤더(Header)에 아래 두 값을 반드시 포함해야 합니다.

```
apikey: {API Key}
Authorization: Bearer {API Key}
```

**예시:**

```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/projects' \
  --header 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dXVkYnhoZmZuYnpqeGdxYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NjQ3MDAsImV4cCI6MjA3MjU0MDcwMH0.WVWlZ2-KZBu1fSHz9u8o7ymbMrLS4G2cglquzcFMZDs' \
  --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dXVkYnhoZmZuYnpqeGdxYWdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5NjQ3MDAsImV4cCI6MjA3MjU0MDcwMH0.WVWlZ2-KZBu1fSHz9u8o7ymbMrLS4G2cglquzcFMZDs'
```

---

## 3. API Endpoints

주요 데이터(프로젝트, 브랜드, 아이템, 태그 등)를 조회할 수 있는 엔드포인트 정보입니다.

### 3.1. 프로젝트 (Projects)

프로젝트 정보는 `projects` 테이블에 저장되어 있습니다. 테이블 컬럼은 `id`, `title`, `description`, `cover_image_url`, `year`, `area`, `status`, `location`, `created_at`, `updated_at`, `slug` 등으로 구성됩니다.

#### A. 모든 프로젝트 목록 조회

- **Method**: `GET`
- **URL**: `/projects`
- **설명**: `published` 상태인 모든 프로젝트 목록을 조회합니다.
- **쿼리 파라미터**:
    - `select`: 가져올 컬럼을 지정합니다. (예: `id,title,cover_image_url`)
    - `status`: 프로젝트 상태로 필터링합니다. (예: `eq.published`)
    - `order`: 정렬 순서를 지정합니다. (예: `year.desc`)

**예시: `published` 상태인 모든 프로젝트의 `id`, `title`, `cover_image_url`, `year`, `location`을 `year` 내림차순으로 조회**

```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/projects?select=id,title,cover_image_url,year,location&status=eq.published&order=year.desc' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```

**응답 예시:**
```json
[
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "공공디자인 개선 프로젝트",
        "cover_image_url": "https://example.com/cover.jpg",
        "year": 2023,
        "location": "Seoul, KR"
    },
    {
        "id": "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
        "title": "스마트 도시 디자인",
        "cover_image_url": "https://example.com/smart_city.jpg",
        "year": 2022,
        "location": "Busan, KR"
    }
]
```

#### B. 특정 프로젝트 상세 조회

- **Method**: `GET`
- **URL**: `/projects?id=eq.{project_id}`
- **설명**: 지정된 `id`를 가진 특정 프로젝트의 상세 정보를 조회합니다.

**예시: 특정 프로젝트의 모든 정보 조회**
```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/projects?id=eq.a1b2c3d4-e5f6-7890-1234-567890abcdef' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```

**응답 예시:**
```json
[
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "공공디자인 개선 프로젝트",
        "description": "이 프로젝트는 도시의 공공 공간을 개선하기 위한 것입니다...",
        "cover_image_url": "https://example.com/cover.jpg",
        "year": 2023,
        "location": "Seoul, KR",
        "area": 150.5,
        "status": "published",
        "created_at": "2023-10-27T10:00:00Z",
        "updated_at": "2023-10-28T12:00:00Z"
    }
]
```

#### C. 관련 데이터와 함께 프로젝트 조회 (매우 유용)

Supabase API의 `select` 파라미터를 사용하면, 한번의 요청으로 프로젝트와 관련된 다른 테이블의 데이터를 함께 가져올 수 있습니다. (SQL의 `JOIN`과 유사)

**예시: 프로젝트 정보와 함께 연관 태그(`project_tags → tags`), 아이템(`project_items → items`), 브랜드(`brands`), 이미지(`project_images`)를 한번에 조회**

```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/projects?select=id,title,description,location,year,status,project_images(id,image_url,order),project_tags(tag_id,tags(id,name,type)),project_items(items(id,slug,name,brands(id,slug,name_ko,name_en))))&id=eq.{project_id}' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```

**응답 예시:**
```json
[
    {
        "id": "a1b2c3d4-e5f6-7890-1234-567890abcdef",
        "title": "공공디자인 개선 프로젝트",
        "description": "이 프로젝트는 도시의 공공 공간을 개선하기 위한 것입니다...",
        "location": "Seoul, KR",
        "year": 2023,
        "status": "published",
        "project_images": [
            {
                "id": "image-id-1",
                "image_url": "https://example.com/image1.jpg",
                "order": 1
            },
            {
                "id": "image-id-2",
                "image_url": "https://example.com/image2.jpg",
                "order": 2
            }
        ],
        "project_tags": [
            {
                "tag_id": "tag-id-1",
                "tags": {
                    "id": "tag-id-1",
                    "name": "도시재생",
                    "type": "project"
                }
            },
            {
                "tag_id": "tag-id-2",
                "tags": {
                    "id": "tag-id-2",
                    "name": "공원",
                    "type": "project"
                }
            }
        ],
        "project_items": [
            {
                "items": {
                    "id": "item-id-1",
                    "slug": "smart-bench",
                    "name": "스마트 벤치",
                    "brands": {
                        "id": "brand-id-1",
                        "slug": "public-furniture-brand",
                        "name_ko": "공공 가구 브랜드",
                        "name_en": "Public Furniture Brand"
                    }
                }
            }
        ]
    }
]
```
---

### 3.2. 브랜드 (Brands)

- **테이블명**: `brands`
- **주요 컬럼**: `id`, `slug`, `name_ko`, `name_en`, `description`, `logo_image_url`, `cover_image_url`, `website_url`, `created_at`, `updated_at`

#### A. 모든 브랜드 목록 조회

- **Method**: `GET`
- **URL**: `/brands?select=id,slug,name_ko,name_en,description,logo_image_url,cover_image_url,website_url`

**예시:**
```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/brands?select=id,slug,name_ko,name_en,description,logo_image_url,cover_image_url,website_url&order=name_ko.asc' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```
---

### 3.3. 아이템 (Items)

- **테이블명**: `items`
- **주요 컬럼**: `id`, `slug`, `name`, `description`, `brand_id`, `nara_url`, `image_url`, `status`, `created_at`, `updated_at`

아이템은 `item_tags` 테이블을 통해 태그와 연결됩니다.

#### A. 모든 아이템 목록 조회

- **Method**: `GET`
- **URL**: `/items?select=id,slug,name,description,image_url,status,nara_url,brand_id,brands(id,slug,name),item_tags(tag_id,tags(id,name,type))`
- **설명**: 모든 아이템 목록을 관련 브랜드 정보와 아이템 태그 정보와 함께 조회합니다.

**예시:**
```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/items?select=id,slug,name,description,image_url,status,nara_url,brand_id,brands(id,slug,name),item_tags(tag_id,tags(id,name,type))&order=name.asc' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```

**응답 예시:**
```json
[
    {
        "id": "item-id-1",
        "slug": "smart-bench",
        "name": "스마트 벤치",
        "image_url": "https://example.com/item1.jpg",
        "status": "available",
        "nara_url": "https://nara.go.kr/item/123",
        "brand_id": "brand-id-1",
        "brands": {
            "id": "brand-id-1",
            "slug": "public-furniture-brand",
            "name": "공공 가구 브랜드"
        },
        "item_tags": [
            {
                "tag_id": "tag-item-1",
                "tags": {
                    "id": "tag-item-1",
                    "name": "벤치",
                    "type": "item"
                }
            }
        ]
    }
]
```
---

### 3.4. 태그 (Tags)

- **테이블명**: `tags`
- **주요 컬럼**: `id`, `name`, `type`, `created_at`

#### A. 태그 타입 및 구조

`tags.type` 컬럼은 `project` 또는 `item` 중 하나의 값을 가집니다. 이를 통해 프로젝트 태그와 아이템 태그를 구분할 수 있습니다.

태그는 아래의 관계 테이블을 통해 프로젝트, 아이템, 이미지에 연결됩니다.

- `project_tags`: 프로젝트와 프로젝트 태그를 연결합니다.
- `item_tags`: 아이템과 아이템 태그를 연결합니다.
- `image_tags`: 프로젝트 이미지와 태그를 연결합니다. 이미지에는 프로젝트/아이템 태그를 혼합해 사용할 수 있습니다.

#### B. 모든 태그 목록 조회

- **Method**: `GET`
- **URL**: `/tags?select=id,name,type`
- **설명**: 모든 태그 목록을 태그 타입과 함께 조회합니다.

**예시:**
```bash
curl -X GET \
  'https://ftuudbxhffnbzjxgqagp.supabase.co/rest/v1/tags?select=id,name,type&order=name.asc' \
  --header 'apikey: {API_KEY}' \
  --header 'Authorization: Bearer {API_KEY}'
```

**응답 예시:**
```json
[
    {
        "id": "tag-project-1",
        "name": "도시재생",
        "type": "project"
    },
    {
        "id": "tag-item-1",
        "name": "벤치",
        "type": "item"
    }
]
```

#### C. 프로젝트 태그만 조회

- **URL**: `/tags?select=id,name&type=eq.project`

#### D. 아이템 태그만 조회

- **URL**: `/tags?select=id,name&type=eq.item`

---

### 3.5. 관계 테이블 요약

프로젝트, 아이템, 이미지와 태그의 관계를 관리하는 테이블입니다. 각 엔드포인트에서 `select`를 통해 연관 데이터를 함께 조회할 때 활용합니다.

- **`project_tags`**: 프로젝트와 태그를 연결합니다. 주로 `tags.type = 'project'` 태그를 참조합니다. (`project_id`, `tag_id`)
- **`item_tags`**: 아이템과 태그를 연결합니다. `tags.type = 'item'` 태그를 참조합니다. (`item_id`, `tag_id`)
- **`image_tags`**: 프로젝트 이미지와 태그를 연결합니다. 프로젝트 태그와 아이템 태그를 모두 사용할 수 있습니다. (`image_id`, `tag_id`)
- **`project_items`**: 프로젝트와 아이템을 연결합니다. (`project_id`, `item_id`)

## 4. 추가 정보

- **필터링, 정렬, 페이지네이션**: Supabase PostgREST API는 강력한 필터링, 정렬, 페이지네이션 기능을 제공합니다. 자세한 내용은 아래 공식 문서를 참고하세요.
  - [Supabase Docs: Filtering](https://supabase.com/docs/reference/javascript/filter)
  - [Supabase Docs: Select Query](https://supabase.com/docs/guides/api/rest/querying-with-select)

- **RLS (Row Level Security)**: 모든 테이블에는 행 수준 보안이 활성화되어 있어, `anon` 키로는 `published` 상태의 데이터 등 공개가 허용된 데이터만 조회할 수 있습니다. (보안 정책은 CMS에서 관리합니다.)

궁금한 점이 있다면 언제든지 문의해주세요.
