import "reflect-metadata";
import {createTestingConnections, closeTestingConnections, reloadTestingDatabases} from "../../utils/test-utils";
import {Connection} from "../../../src/connection/Connection";
import {Post} from "./entity/Post";
import {expect} from "chai";

describe("other issues > column with getter / setter should work", () => {

    let connections: Connection[];
    before(async () => connections = await createTestingConnections({
        entities: [__dirname + "/entity/*{.js,.ts}"],
        schemaCreate: true,
        dropSchemaOnConnection: true,
    }));
    beforeEach(() => reloadTestingDatabases(connections));
    after(() => closeTestingConnections(connections));

    it("getters and setters should work correctly", () => Promise.all(connections.map(async connection => {

        const post = new Post();
        post.title = "Super title";
        post.text = "About this post";
        await connection.entityManager.persist(post);

        const loadedPost = await connection
            .entityManager
            .createQueryBuilder(Post, "post")
            .where("post.id = :id", { id: 1 })
            .getOne();

        expect(loadedPost).not.to.be.empty;
        expect(loadedPost!.title).not.to.be.empty;
        expect(loadedPost!.text).not.to.be.empty;
        loadedPost!.title.should.be.equal("Super title");
        loadedPost!.text.should.be.equal("About this post");

    })));

});