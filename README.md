# LangChain FastAPI + Node.js Template

Dự án mẫu cho việc xây dựng ứng dụng AI sử dụng FastAPI cho backend và Node.js (Next.js) cho frontend.

## Cấu trúc dự án

```text
Market-Pulse/
├── backend/                # FastAPI Backend
│   ├── app/                # Mã nguồn chính
│   │   ├── api/            # API Endpoints
│   │   ├── core/           # Cấu hình & Bảo mật
│   │   ├── models/         # Database models (nếu có)
│   │   ├── schemas/        # Pydantic schemas (Validation)
│   │   └── services/       # Logic nghiệp vụ & LangChain
│   ├── tests/              # Unit & Integration tests
│   ├── Dockerfile          # Docker configuration cho backend
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js Frontend
│   ├── public/             # Static assets
│   ├── src/                # Mã nguồn chính
│   │   ├── components/     # UI Components
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   └── styles/         # CSS/Tailwind styles
│   ├── Dockerfile          # Docker configuration cho frontend
│   └── package.json        # Node.js dependencies
└── docker-compose.yml      # Orchestration
```

## Khởi chạy nhanh

1. Sao chép file `.env.example` thành `.env` trong thư mục `backend/` và điền `GOOGLE_API_KEY`.
2. Chạy với Docker Compose:

```bash
docker-compose up --build
```

- Backend sẽ chạy tại: `http://localhost:8000`
- API Documentation (Swagger): `http://localhost:8000/docs`
- Frontend sẽ chạy tại: `http://localhost:3000`

## Công nghệ sử dụng

- **Backend:** FastAPI, LangChain, Pydantic, Uvicorn.
- **Frontend:** Next.js, React, Tailwind CSS, Axios.
- **Deployment:** Docker, Docker Compose.
