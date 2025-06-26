# CivicAI API Documentation v2.0

This document outlines the comprehensive REST API endpoints for the CivicAI platform - an advanced Web3 governance platform for crypto cities and island communities.

## Base URL
```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

### Wallet-Based Authentication
The API uses cryptographic signature-based authentication for secure Web3 integration:

```http
Authorization: Bearer <base64_encoded_session_token>
```

**Session Token Structure:**
```json
{
  "address": "0x...",
  "timestamp": 1672531200000,
  "nonce": "random_string"
}
```

### Rate Limiting
- **Voting**: 10 requests per minute per wallet
- **Proposal Creation**: 3 requests per hour per wallet  
- **General API**: 100 requests per minute per IP

## Error Responses
All endpoints return consistent error responses with detailed information:

```json
{
  "success": false,
  "error": "Detailed error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created successfully  
- `400` - Bad request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Resource not found
- `429` - Rate limit exceeded
- `500` - Internal server error

---

## 🔐 Authentication Endpoints

### Login with Wallet
Authenticate user with wallet signature.

**Endpoint:** `POST /api/auth`

**Request Body:**
```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "signature": "0x...",
  "message": "Login message with nonce",
  "nonce": "random_nonce_string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "display_name": "User 0x1234...5678",
    "reputation_score": 150,
    "is_verified": true,
    "ens_name": "user.eth"
  },
  "session_token": "base64_encoded_token"
}
```

### Verify Session
Verify current session token.

**Endpoint:** `GET /api/auth`
**Headers:** `Authorization: Bearer <session_token>`

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "display_name": "User Name",
    "reputation_score": 150,
    "is_verified": true
  }
}
```

### Logout
Invalidate current session.

**Endpoint:** `DELETE /api/auth`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## AI Generation

### Generate AI Proposal
Generates a detailed civic proposal using OpenAI based on a problem description.

**Endpoint:** `POST /api/ai/generate`

**Request Body:**
```json
{
  "problem": "Traffic congestion during rush hours",
  "category": "transportation", 
  "location": "Roatán",
  "urgency": "medium"
}
```

**Request Schema:**
- `problem` (string, required) - Description of the civic issue
- `category` (string, required) - Category: transportation, infrastructure, environment, governance, social, economic
- `location` (string, optional) - Geographic location 
- `urgency` (string, optional) - Priority level: low, medium, high

**Response (200):**
```json
{
  "title": "Dynamic Traffic Management System for Roatán",
  "description": "Implement smart traffic lights and real-time routing...",
  "category": "transportation",
  "impact_score": 75,
  "cost_estimate": 250000,
  "timeline": "6-8 months",
  "feasibility_score": 80,
  "potential_risks": [
    "Initial setup costs",
    "Technical maintenance requirements"
  ],
  "recommendations": [
    "Partner with local tech companies",
    "Implement in phases"
  ],
  "icc_incentives": "Stake ICC tokens for proposal implementation milestones"
}
```

**Error Responses:**
- `400` - Missing required fields (problem, category)
- `500` - AI generation failed

---

## Proposals

### Get Proposals
Retrieves a list of proposals with optional filtering.

**Endpoint:** `GET /api/proposals`

**Query Parameters:**
- `status` (string, optional) - Filter by status: draft, active, completed, rejected
- `category` (string, optional) - Filter by category
- `limit` (number, optional) - Maximum number of results

**Example Request:**
```
GET /api/proposals?status=active&category=transportation&limit=10
```

**Response (200):**
```json
[
  {
    "id": "uuid-string",
    "title": "Smart Traffic Management System",
    "description": "Detailed proposal description...",
    "category": "transportation",
    "status": "active",
    "created_by": "user-uuid",
    "created_at": "2025-06-26T10:00:00.000Z",
    "voting_ends_at": "2025-07-03T10:00:00.000Z",
    "required_votes": 10,
    "current_votes": 7,
    "impact_score": 75,
    "creator_username": "john_doe",
    "for_votes": 5,
    "against_votes": 2,
    "abstain_votes": 0,
    "support_percentage": 71
  }
]
```

### Create Proposal
Creates a new civic proposal in the system.

**Endpoint:** `POST /api/proposals`

**Request Body:**
```json
{
  "title": "Smart Traffic Management System",
  "description": "Implement AI-powered traffic management...",
  "category": "transportation",
  "created_by": "user-uuid",
  "ai_analysis": {
    "impact_score": 75,
    "feasibility_score": 80,
    "cost_estimate": 250000,
    "timeline": "6-8 months",
    "potential_risks": ["High initial cost"],
    "recommendations": ["Phase implementation"]
  }
}
```

**Request Schema:**
- `title` (string, required) - Proposal title (max 200 chars)
- `description` (string, required) - Detailed proposal description
- `category` (string, required) - Proposal category
- `created_by` (string, required) - User ID of creator
- `ai_analysis` (object, optional) - AI-generated analysis data

**Response (201):**
```json
{
  "id": "uuid-string",
  "title": "Smart Traffic Management System",
  "description": "Implement AI-powered traffic management...",
  "category": "transportation", 
  "status": "draft",
  "created_by": "user-uuid",
  "created_at": "2025-06-26T10:00:00.000Z",
  "voting_ends_at": "2025-07-03T10:00:00.000Z",
  "required_votes": 10,
  "current_votes": 0,
  "impact_score": 75
}
```

**Error Responses:**
- `400` - Missing required fields
- `500` - Database error

---

## Voting

### Submit Vote
Submits or updates a vote on a proposal.

**Endpoint:** `POST /api/votes`

**Request Body:**
```json
{
  "proposal_id": "proposal-uuid",
  "user_id": "user-uuid", 
  "vote_type": "for",
  "reasoning": "This proposal addresses a critical infrastructure need"
}
```

**Request Schema:**
- `proposal_id` (string, required) - UUID of the proposal
- `user_id` (string, required) - UUID of the voting user
- `vote_type` (string, required) - Vote choice: "for", "against", "abstain"
- `reasoning` (string, optional) - Explanation for the vote

**Response (201/200):**
```json
{
  "vote": {
    "id": "vote-uuid",
    "proposal_id": "proposal-uuid",
    "user_id": "user-uuid",
    "vote_type": "for",
    "reasoning": "This proposal addresses a critical infrastructure need",
    "weight": 1,
    "created_at": "2025-06-26T10:00:00.000Z"
  },
  "message": "Vote submitted successfully"
}
```

**Error Responses:**
- `400` - Missing required fields or invalid vote_type
- `500` - Database error

### Get Proposal Votes
Retrieves all votes for a specific proposal with statistics.

**Endpoint:** `GET /api/votes?proposal_id={proposal_id}`

**Query Parameters:**
- `proposal_id` (string, required) - UUID of the proposal

**Example Request:**
```
GET /api/votes?proposal_id=abc123-def456-ghi789
```

**Response (200):**
```json
{
  "votes": [
    {
      "id": "vote-uuid",
      "proposal_id": "proposal-uuid",
      "user_id": "user-uuid",
      "vote_type": "for",
      "reasoning": "Great idea for the community",
      "weight": 1,
      "created_at": "2025-06-26T10:00:00.000Z",
      "users": {
        "username": "john_doe",
        "avatar_url": "https://example.com/avatar.jpg"
      }
    }
  ],
  "stats": {
    "total_votes": 7,
    "for_votes": 5,
    "against_votes": 2, 
    "abstain_votes": 0,
    "support_percentage": 71
  }
}
```

**Error Responses:**
- `400` - Missing proposal_id parameter
- `500` - Database error

---

## 👤 User Management Endpoints

### Get User Profile
Retrieve user profile by wallet address.

**Endpoint:** `GET /api/users/[address]`

**Parameters:**
- `address` - Ethereum wallet address

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "display_name": "User Name",
    "ens_name": "user.eth",
    "reputation_score": 150,
    "is_verified": true,
    "badges": [
      {
        "id": "uuid",
        "badge_type": "first_vote",
        "earned_at": "2024-01-01T00:00:00Z"
      }
    ],
    "vote_count": 25,
    "proposal_count": 3,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "voting_history": [
    {
      "proposal_id": "uuid",
      "vote_type": "for",
      "reasoning": "This proposal addresses critical infrastructure needs",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Update User Profile
Update user profile information.

**Endpoint:** `PUT /api/users/[address]`
**Headers:** `Authorization: Bearer <session_token>`

**Request Body:**
```json
{
  "display_name": "New Display Name",
  "bio": "User biography"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "wallet_address": "0x...",
    "display_name": "New Display Name",
    "bio": "User biography",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

## 🏛️ Proposal Management Endpoints

### Get All Proposals
Retrieve paginated list of proposals with filtering options.

**Endpoint:** `GET /api/proposals`

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)
- `category` (optional) - Filter by category
- `status` (optional) - Filter by status
- `search` (optional) - Search in title and description

**Success Response (200):**
```json
{
  "success": true,
  "proposals": [
    {
      "id": "uuid",
      "title": "Improve Public Transportation",
      "description": "Detailed proposal description...",
      "category": "infrastructure",
      "status": "active",
      "impact_score": 85,
      "cost_estimate": 50000,
      "timeline": "6-12 months",
      "feasibility_score": 92,
      "votes_for": 150,
      "votes_against": 25,
      "votes_abstain": 10,
      "total_votes": 185,
      "creator_address": "0x...",
      "created_at": "2024-01-01T00:00:00Z",
      "voting_deadline": "2024-01-15T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

### Get Single Proposal
Retrieve detailed information about a specific proposal.

**Endpoint:** `GET /api/proposals/[id]`

**Parameters:**
- `id` - Proposal UUID

**Success Response (200):**
```json
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "Improve Public Transportation",
    "description": "Detailed proposal description...",
    "category": "infrastructure",
    "status": "active",
    "impact_score": 85,
    "cost_estimate": 50000,
    "timeline": "6-12 months",
    "feasibility_score": 92,
    "potential_risks": [
      "Budget overruns",
      "Implementation delays"
    ],
    "recommendations": [
      "Phased implementation approach",
      "Regular stakeholder consultations"
    ],
    "icc_incentives": "500 ICC tokens for successful implementation",
    "votes_for": 150,
    "votes_against": 25,
    "votes_abstain": 10,
    "total_votes": 185,
    "creator": {
      "wallet_address": "0x...",
      "display_name": "Proposal Creator",
      "ens_name": "creator.eth"
    },
    "created_at": "2024-01-01T00:00:00Z",
    "voting_deadline": "2024-01-15T00:00:00Z"
  }
}
```

### Create New Proposal
Create a new governance proposal.

**Endpoint:** `POST /api/proposals`
**Headers:** `Authorization: Bearer <session_token>`

**Request Body:**
```json
{
  "title": "Proposal Title",
  "description": "Detailed proposal description",
  "category": "infrastructure",
  "impact_score": 85,
  "cost_estimate": 50000,
  "timeline": "6-12 months",
  "feasibility_score": 92,
  "potential_risks": ["Risk 1", "Risk 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "icc_incentives": "Reward description"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "Proposal Title",
    "status": "active",
    "created_at": "2024-01-01T00:00:00Z",
    "voting_deadline": "2024-01-15T00:00:00Z"
  }
}
```

### Update Proposal
Update an existing proposal (creator only).

**Endpoint:** `PUT /api/proposals/[id]`
**Headers:** `Authorization: Bearer <session_token>`

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "proposal": {
    "id": "uuid",
    "title": "Updated Title",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Proposal updated successfully"
}
```

### Delete Proposal
Delete a proposal (creator only, no votes cast).

**Endpoint:** `DELETE /api/proposals/[id]`
**Headers:** `Authorization: Bearer <session_token>`

**Success Response (200):**
```json
{
  "success": true,
  "message": "Proposal deleted successfully"
}
```

---

## 🗳️ Voting Endpoints

### Cast Vote
Submit a cryptographically-signed vote on a proposal.

**Endpoint:** `POST /api/votes`
**Headers:** `Authorization: Bearer <session_token>`

**Request Body:**
```json
{
  "proposal_id": "uuid",
  "vote_type": "for",
  "reasoning": "This proposal addresses critical infrastructure needs",
  "signature": "0x...",
  "message_hash": "0x...",
  "timestamp": 1672531200000
}
```

**Success Response (201):**
```json
{
  "success": true,
  "vote": {
    "id": "uuid",
    "proposal_id": "uuid",
    "vote_type": "for",
    "wallet_address": "0x...",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Vote recorded successfully"
}
```

### Get Proposal Votes
Retrieve all votes for a specific proposal.

**Endpoint:** `GET /api/votes?proposal_id=[id]`

**Query Parameters:**
- `proposal_id` - Proposal UUID

**Success Response (200):**
```json
{
  "success": true,
  "votes": [
    {
      "id": "uuid",
      "proposal_id": "uuid",
      "vote_type": "for",
      "reasoning": "Supporting this initiative",
      "wallet_address": "0x...",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "statistics": {
    "total_votes": 185,
    "votes_for": 150,
    "votes_against": 25,
    "votes_abstain": 10,
    "for_percentage": 81,
    "against_percentage": 14,
    "abstain_percentage": 5
  }
}
```

---

## 📊 Analytics Endpoints

### Platform Statistics
Get overall platform usage statistics.

**Endpoint:** `GET /api/analytics/stats`

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "total_proposals": 156,
    "active_proposals": 12,
    "total_votes": 2847,
    "unique_voters": 421,
    "total_users": 856,
    "verified_users": 234
  }
}
```

### User Analytics
Get analytics for a specific user.

**Endpoint:** `GET /api/analytics/users/[address]`

**Success Response (200):**
```json
{
  "success": true,
  "analytics": {
    "votes_cast": 25,
    "proposals_created": 3,
    "reputation_score": 150,
    "badges_earned": 4,
    "voting_streak": 12,
    "participation_rate": 0.85
  }
}
```

---

## SDK and Integration

### JavaScript/TypeScript Example
```typescript
// Generate AI proposal
const response = await fetch('/api/ai/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    problem: 'Poor street lighting in downtown area',
    category: 'infrastructure',
    urgency: 'high'
  })
})
const proposal = await response.json()

// Submit proposal  
const createResponse = await fetch('/api/proposals', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: proposal.title,
    description: proposal.description,
    category: proposal.category,
    created_by: userId,
    ai_analysis: proposal
  })
})

// Vote on proposal
const voteResponse = await fetch('/api/votes', {
  method: 'POST', 
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    proposal_id: proposalId,
    user_id: userId,
    vote_type: 'for',
    reasoning: 'Essential for community safety'
  })
})
```

---

## Support

For API support and questions:
- GitHub Issues: [CivicAI Repository](https://github.com/daghondi/civicai)
- Documentation: [Full Documentation](https://docs.civicai.app)
- Community: [Discord Server](https://discord.gg/civicai)