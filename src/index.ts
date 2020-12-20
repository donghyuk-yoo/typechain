import * as CryptoJS from "crypto-js";

// BLOCK STRUCTURE
class Block {
  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.data === "string";

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, "2020202020202", "", "Hello", 123456); // 첫번째 block

let blockchain: Block[] = [genesisBlock]; // blockchain 배열 생성, 초기화, 현 블록 갯수 1(genesisBlock)

// const getBlockchain = (): Block[] => blockchain;

const getLatesBlock = (): Block => blockchain[blockchain.length - 1]; // 마지막 블록 get

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000); 

const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatesBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    data,
    newTimestamp
  );
  addBlock(newBlock);
  return newBlock;
};

const getHashforBlock = (aBlock: Block) :string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

// 블록체인 검증과정
const isBlockValid = (
  candidateBlock: Block,
  previousBlock: Block
): boolean => {
    if(!Block.validateStructure(candidateBlock)){ 
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index) { // 이전블록의 인덱스 +1 = 추가예정 다음블록
        return false;
    } else if(previousBlock.hash !== candidateBlock.previousHash) { // hash값 비교, 이전블록해쉬값이 추가예정 다음블록에 기록되있는 것과 같아야함
        return false;
    } else if(getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false;
    } else {
        return true;
    }
};

// 블록체인에 블록 추가
const addBlock = (candidateBlock: Block) : void => {
    if(isBlockValid(candidateBlock, getLatesBlock())) { // 검증과정 통과시
        blockchain.push(candidateBlock);    // 블록체인에 블록추가
    }
};

createNewBlock("second block");
createNewBlock("third block");
createNewBlock("fourth block");

console.log(blockchain);

export {};
