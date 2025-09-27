import { GraphQLClient } from 'graphql-request';
import dotenv from 'dotenv';

dotenv.config();

// Query interface for The Graph's public knowledge graph data
export class TrustNetworkQuerier {
  private client: GraphQLClient;
  private spaceId: string;

  constructor(endpoint: string, spaceId: string) {
    this.client = new GraphQLClient(endpoint);
    this.spaceId = spaceId;
  }

  // Query all users with trust scores
  async getUsersWithTrustScores(minTrustScore: number = 0): Promise<any> {
    const query = `
      query GetUsersWithTrustScores($spaceId: String!, $minTrustScore: Float!) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:User",
            properties: {
              trustScore: { gte: $minTrustScore }
            }
          }
        ) {
          id
          properties {
            address
            verified
            isReviewer
            trustScore
            reputation
            joinedAt
          }
          relationships {
            type
            target
            properties
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, minTrustScore });
  }

  // Query skill experts (users with high ratings for specific skills)
  async getSkillExperts(skillHash?: string, minRating: number = 8): Promise<any> {
    const query = `
      query GetSkillExperts($spaceId: String!, $skillHash: String, $minRating: Float!) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:Rating",
            properties: {
              rating: { gte: $minRating }
            }
            ${skillHash ? `, relationships: { target: { contains: "${skillHash}" } }` : ''}
          }
        ) {
          id
          properties {
            rating
            timestamp
            confidence
          }
          relationships {
            type
            target
            properties {
              skill
              rating
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, minRating, skillHash });
  }

  // Query trust network connections (who trusts whom)
  async getTrustNetwork(userAddress?: string, maxDepth: number = 2): Promise<any> {
    const query = `
      query GetTrustNetwork($spaceId: String!, $userAddress: String, $maxDepth: Int!) {
        relationships(
          spaceId: $spaceId,
          filter: {
            type: "trust:rates",
            ${userAddress ? `from: "user:${userAddress}",` : ''}
            depth: { lte: $maxDepth }
          }
        ) {
          id
          type
          from
          to
          properties {
            rating
            timestamp
            confidence
          }
          metadata {
            verification {
              onchainProof
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, userAddress, maxDepth });
  }

  // Query job sponsorship patterns
  async getSponsorshipPatterns(jobHash?: string): Promise<any> {
    const query = `
      query GetSponsorshipPatterns($spaceId: String!, $jobHash: String) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:Sponsorship",
            ${jobHash ? `relationships: { properties: { job: "${jobHash}" } }` : ''}
          }
        ) {
          id
          properties {
            creditsSpent
            timestamp
            sponsorshipType
          }
          relationships {
            type
            target
            properties {
              job
              creditsSpent
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, jobHash });
  }

  // Query hiring success rates
  async getHiringSuccessRates(): Promise<any> {
    const query = `
      query GetHiringSuccessRates($spaceId: String!) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:HiringOutcome"
          }
        ) {
          id
          properties {
            isHired
            timestamp
            successRate
          }
          relationships {
            type
            target
            properties {
              outcome
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId });
  }

  // Advanced query: Find most trusted reviewers
  async getMostTrustedReviewers(limit: number = 10): Promise<any> {
    const query = `
      query GetMostTrustedReviewers($spaceId: String!, $limit: Int!) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:User",
            properties: {
              isReviewer: true
            }
          },
          orderBy: {
            property: "trustScore",
            direction: "DESC"
          },
          limit: $limit
        ) {
          id
          properties {
            address
            trustScore
            reputation
            verified
          }
          relationships(filter: { type: "trust:rates" }) {
            id
            properties {
              rating
              confidence
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, limit });
  }

  // Advanced query: Skill competency mapping
  async getSkillCompetencyMap(): Promise<any> {
    const query = `
      query GetSkillCompetencyMap($spaceId: String!) {
        entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:Skill"
          }
        ) {
          id
          properties {
            skillHash
            name
            category
            averageRating
            totalRatings
          }
          relationships(filter: { type: "trust:rates" }) {
            id
            from
            properties {
              rating
              confidence
            }
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId });
  }

  // Advanced query: Network effect analysis  
  async getNetworkEffectAnalysis(userAddress: string): Promise<any> {
    const query = `
      query GetNetworkEffectAnalysis($spaceId: String!, $userAddress: String!) {
        # Get direct ratings received
        directRatings: relationships(
          spaceId: $spaceId,
          filter: {
            type: "trust:rates",
            to: "user:${userAddress}"
          }
        ) {
          id
          from
          properties {
            rating
            confidence
            timestamp
          }
        }
        
        # Get sponsorships received
        sponsorships: relationships(
          spaceId: $spaceId,
          filter: {
            type: "trust:sponsors", 
            to: "user:${userAddress}"
          }
        ) {
          id
          from
          properties {
            creditsSpent
            sponsorshipType
          }
        }
        
        # Get hiring outcomes
        hiringOutcomes: entities(
          spaceId: $spaceId,
          filter: {
            type: "trust:HiringOutcome",
            relationships: {
              target: "user:${userAddress}"
            }
          }
        ) {
          id
          properties {
            isHired
            timestamp
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId, userAddress });
  }

  // Query schema information
  async getSchemaInfo(): Promise<any> {
    const query = `
      query GetSchemaInfo($spaceId: String!) {
        schema(spaceId: $spaceId) {
          name
          version
          description
          entities {
            name
            description
            properties
          }
          relationships {
            name
            description
            from
            to
            properties
          }
        }
      }
    `;

    return await this.client.request(query, { spaceId: this.spaceId });
  }
}

// Utility functions for data analysis
export class TrustNetworkAnalytics {
  private querier: TrustNetworkQuerier;

  constructor(querier: TrustNetworkQuerier) {
    this.querier = querier;
  }

  // Calculate trust propagation through the network
  async calculateTrustPropagation(userAddress: string): Promise<number> {
    const networkData = await this.querier.getNetworkEffectAnalysis(userAddress);
    
    // Implement trust propagation algorithm
    let trustScore = 0;
    
    // Weight direct ratings
    if (networkData.directRatings) {
      const avgRating = networkData.directRatings.reduce((sum: number, rating: any) => 
        sum + rating.properties.rating * rating.properties.confidence, 0
      ) / networkData.directRatings.length;
      trustScore += avgRating * 0.6; // 60% weight for direct ratings
    }

    // Weight sponsorships
    if (networkData.sponsorships) {
      const totalCredits = networkData.sponsorships.reduce((sum: number, sponsorship: any) => 
        sum + sponsorship.properties.creditsSpent, 0
      );
      trustScore += Math.min(totalCredits / 1000, 4) * 0.3; // 30% weight for sponsorships
    }

    // Weight hiring success
    if (networkData.hiringOutcomes) {
      const successRate = networkData.hiringOutcomes.filter((outcome: any) => 
        outcome.properties.isHired
      ).length / networkData.hiringOutcomes.length;
      trustScore += successRate * 10 * 0.1; // 10% weight for hiring success
    }

    return Math.min(trustScore, 10); // Cap at 10
  }

  // Identify skill clusters in the network
  async identifySkillClusters(): Promise<any[]> {
    const skillData = await this.querier.getSkillCompetencyMap();
    
    // Group skills by category and analyze rating patterns
    const clusters = skillData.reduce((acc: any, skill: any) => {
      const category = skill.properties.category || 'uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        skill: skill.properties.name,
        avgRating: skill.properties.averageRating,
        totalRatings: skill.properties.totalRatings,
        reviewers: skill.relationships.map((r: any) => r.from)
      });
      return acc;
    }, {});

    return Object.entries(clusters).map(([category, skills]) => ({
      category,
      skills,
      clusterSize: (skills as any[]).length,
      avgCompetency: (skills as any[]).reduce((sum: number, s: any) => sum + s.avgRating, 0) / (skills as any[]).length
    }));
  }

  // Predict hiring success based on ratings and sponsorships
  async predictHiringSuccess(userAddress: string): Promise<number> {
    const userData = await this.querier.getNetworkEffectAnalysis(userAddress);
    
    let successProbability = 0.5; // Base probability

    // Factor in average ratings
    if (userData.directRatings && userData.directRatings.length > 0) {
      const avgRating = userData.directRatings.reduce((sum: number, rating: any) => 
        sum + rating.properties.rating, 0
      ) / userData.directRatings.length;
      successProbability += (avgRating - 5) * 0.1; // Each point above 5 adds 10%
    }

    // Factor in sponsorship support
    if (userData.sponsorships && userData.sponsorships.length > 0) {
      const totalSponsors = new Set(userData.sponsorships.map((s: any) => s.from)).size;
      successProbability += Math.min(totalSponsors * 0.05, 0.2); // Each unique sponsor adds 5%, max 20%
    }

    // Factor in historical success
    if (userData.hiringOutcomes && userData.hiringOutcomes.length > 0) {
      const successRate = userData.hiringOutcomes.filter((outcome: any) => 
        outcome.properties.isHired
      ).length / userData.hiringOutcomes.length;
      successProbability = successProbability * 0.7 + successRate * 0.3; // Weighted historical success
    }

    return Math.min(Math.max(successProbability, 0), 1); // Clamp between 0 and 1
  }
}

export default TrustNetworkQuerier;