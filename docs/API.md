# CivicAI API Documentation

This document outlines the REST API endpoints for the CivicAI platform, featuring advanced wallet-based authentication, cryptographic voting, and AI-powered proposal generation.

## Base URL
```
http://localhost:3000/api (development)
https://your-domain.com/api (production)
```

## Authentication

### Wallet-Based Authentication
The API uses wallet signature verification for secure authentication. Users sign messages with their wallets to prove ownership.

#### Authentication Headers
```
Authorization: Bearer <session_token>
```

#### Authentication Flow
1. **Connect Wallet**: User connects wallet via Thirdweb SDK
2. **Sign Message**: User signs authentication message
3. **Verify Signature**: Server verifies signature and creates session
4. **Session Token**: Client receives JWT-style session token

### Rate Limiting
API endpoints are protected with rate limiting:
- **Voting**: 10 requests per minute per wallet
- **Proposal Creation**: 3 requests per hour per wallet  
- **General API**: 100 requests per minute per IP

## Error Responses
All endpoints return consistent error responses:
```json
{
  "success": false,
  "error": "Error message description",
  "status": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created successfully  
- `400` - Bad request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `429` - Too many requests (rate limited)
- `500` - Internal server error

---

## Authentication Endpoints

### Wallet Authentication
Authenticate users via wallet signature verification.

**Endpoint:** `POST /api/auth`

**Request Body:**
```json
{
  "address": "0x742d35cc6bb1966c1e55afe012b47063c12c9",
  "signature": "0x...",
  "message": "CivicAI Authentication...",
  "nonce": "random_nonce_string"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "wallet_address": "0x742d35cc6bb1966c1e55afe012b47063c12c9",
    "display_name": "User 0x742d...2c9",
    "reputation_score": 150,
    "is_verified": true,
    "ens_name": "alice.eth"
  },
  "session_token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

### Verify Session
Verify existing session token and get user data.

**Endpoint:** `GET /api/auth`

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_uuid",
    "wallet_address": "0x742d35cc6bb1966c1e55afe012b47063c12c9",
    "display_name": "User 0x742d...2c9",
    "reputation_score": 150,
    "is_verified": true
  }
}
```

### Logout
Invalidate session token.

**Endpoint:** `DELETE /api/auth`

**Response:**
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

## Data Models

### Proposal Categories
- `transportation` - Traffic, public transit, mobility
- `infrastructure` - Utilities, buildings, maintenance  
- `environment` - Sustainability, conservation, green initiatives
- `governance` - Policy, regulations, community management
- `social` - Community programs, healthcare, education
- `economic` - Business development, taxation, incentives

### Vote Types
- `for` - Support the proposal
- `against` - Oppose the proposal  
- `abstain` - Neither support nor oppose

### Proposal Status
- `draft` - Initial proposal, can be edited
- `active` - Open for voting
- `completed` - Voting finished, passed
- `rejected` - Voting finished, failed

---

## Rate Limiting
API endpoints are currently not rate limited but will implement the following limits in production:

- `/api/ai/generate`: 10 requests per minute per IP
- `/api/proposals`: 100 requests per minute per IP  
- `/api/votes`: 50 requests per minute per IP

---

## Future Enhancements

### Planned Features
1. **Authentication**: JWT tokens with wallet signature verification
2. **Pagination**: Cursor-based pagination for large datasets
3. **Real-time Updates**: WebSocket support for live vote counts
4. **File Uploads**: Support for proposal attachments and images
5. **Advanced Filtering**: Full-text search and complex filters
6. **Analytics**: Detailed proposal performance metrics

### Webhook Support
Future versions will support webhooks for:
- New proposal submissions
- Vote milestones reached
- Proposal status changes
- AI analysis completion

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