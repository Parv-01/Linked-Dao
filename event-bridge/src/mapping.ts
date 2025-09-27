import type { Mapping } from '@graphprotocol/hypergraph/mapping';
import { Id } from '@graphprotocol/hypergraph';

// Mirror the mapping from linked-dao/src/mapping.ts for the bridge
export const mapping: Mapping = {
  User: {
    typeIds: [Id("cb0d98d5-69d5-475c-a0f6-4a29a75a243d")],
    properties: {
      address: Id("7014e234-4adc-4f5f-8888-d827cf03a199"),
      verified: Id("8db628a4-d1cd-410b-a2b7-26edeec5639d"),
      isReviewer: Id("af6d0a89-4030-4eed-9ac8-9475e0045d14"),
      approvedAt: Id("b8a6f87b-b873-4d4d-b9ff-bf3e83cee1ab"),
      totalRatingsGiven: Id("7f3044b7-f7e2-4149-a0f5-52f493ea8ff4"),
      totalRatingsReceived: Id("bc3b83b0-8a84-485e-94a2-1a4723cef701"),
      averageRating: Id("f4f06a1b-be7f-48c1-a42d-8398cee698f7"),
      totalCreditsSpent: Id("79a821bc-cf2d-4ef4-9e57-4c130501772b"),
      joinedAt: Id("bd2370c4-fb68-4f62-a692-6607bfad4f38"),
      lastActivity: Id("a780dd83-49eb-4e7d-abb7-9b9067f9e62f")
    },
  },
  Skill: {
    typeIds: [Id("b373c35f-2628-4cce-8177-04923682eb97")],
    properties: {
      skillHash: Id("ad97773a-68c4-4151-844d-8b075f54b154"),
      name: Id("a8d53676-4166-47a0-b515-def149043e0e"),
      totalRatings: Id("c497283c-330c-4d68-b477-76a8db461ede"),
      averageRating: Id("c94f0928-a5dd-4da3-a459-0555c9f19d21"),
      firstRatedAt: Id("31030170-d316-4c02-8140-b7b9dfc8d08e"),
      lastRatedAt: Id("e8d52b2a-e590-4530-9af0-9d604594bf01")
    },
  },
  Job: {
    typeIds: [Id("e0fb7055-e871-4eb7-ab3a-10bdda1a5ef9")],
    properties: {
      jobIdHash: Id("e2c21e1c-3f09-4aa0-878a-c15b8cc15793"),
      description: Id("a7f433d1-a6ef-44e6-aec1-719207030041"),
      totalCreditsSpent: Id("c502c25d-758a-46af-969e-1cd4ea8ffb57"),
      totalSponsorships: Id("a902e05a-fc40-46b3-8cc0-9d843eec228b"),
      firstSponsoredAt: Id("7fd4fec2-d4d5-4409-a01c-6dad33530ff0"),
      lastSponsoredAt: Id("d3e7d313-a414-424e-9461-96970542df22")
    },
  },
  Rating: {
    typeIds: [Id("a150afca-2a51-4c45-ad11-3010d1d85c8d")],
    properties: {
      overallRating: Id("24c57c88-647b-4c6f-a28c-52a018fabeb5"),
      timestamp: Id("bfd0d568-5c70-4ba8-88a5-e708387b4ca1"),
      transactionHash: Id("286e3c37-0515-43fe-a13b-0baa56250309"),
      blockNumber: Id("208cc9f1-59a3-4d96-a7f7-39dd3500ed42")
    },
    relations: {
      reviewer: Id("e7f993a0-1814-4757-8dfa-db8ae4d90f42"),
      junior: Id("7cee7b92-0ace-4a80-bf4a-92d16dc9ab5c"),
      skill: Id("a6dd62e7-7eed-4bd7-b595-006f23d16f88")
    },
  },
  Sponsorship: {
    typeIds: [Id("93137669-52e5-4b85-9c09-afd18bffad11")],
    properties: {
      creditsUsed: Id("4d83acea-81fc-4d0d-a1f2-aaa2c7cb2bad"),
      timestamp: Id("daf1186e-63aa-4239-bf77-b244f59feebe"),
      transactionHash: Id("991b146c-e9ff-4736-b350-98bdbd766d57"),
      blockNumber: Id("cc14ba11-111d-4176-9e55-c2548d609d61")
    },
    relations: {
      sponsor: Id("fae75b46-24f0-4f23-b73c-cf3dd241d980"),
      candidate: Id("26fab6f8-4296-448a-b53f-ba528e6d9978"),
      job: Id("1dc6ef45-62c9-46f4-8ca0-2dae88277894")
    },
  },
  HiringOutcome: {
    typeIds: [Id("f2071c59-5c01-493e-8675-863351a227ed")],
    properties: {
      isHired: Id("501e9086-afae-47ba-88c8-5d9f59af6e5c"),
      timestamp: Id("80d2381f-db6c-4242-811c-48de64624b97"),
      transactionHash: Id("7661e39d-d34d-4ed6-90ca-45f80c4caf24"),
      blockNumber: Id("bc72e57c-cf0a-4f6f-99fa-24d489bf2695")
    },
    relations: {
      candidate: Id("8fbdd2d9-cd22-4561-a76e-3133e980f1ea")
    },
  }
};