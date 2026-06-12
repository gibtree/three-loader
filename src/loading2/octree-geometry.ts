import {Box3, Sphere, Vector3} from 'three';
import {OctreeGeometryNode} from './octree-geometry-node';
import {Metadata, NodeLoader} from './octree-loader';
import {PointAttributes} from './point-attributes';

export class OctreeGeometry {
	boundingSphere: Sphere;
	tightBoundingBox: Box3;
	tightBoundingSphere: Sphere;
	maxNumNodesLoading: number = 3;
	numNodesLoading: number = 0;
    needsUpdate: boolean = true;
	disposed: boolean = false;
	offset!: Vector3;
	pointAttributes: PointAttributes | null = null;
	projection?: Metadata['projection'];
	root!: OctreeGeometryNode;
	scale!: [number, number, number];
	spacing: number = 0;
	url: string | null = null;
	tile_definition?: {
		epsg: number;
		size: number;
		i: number;
		j: number;
	} = undefined;

	constructor(
		public loader: NodeLoader,
		public boundingBox: Box3,
	) {
		this.tightBoundingBox = this.boundingBox.clone();
		this.boundingSphere = this.boundingBox.getBoundingSphere(new Sphere());
		this.tightBoundingSphere = this.boundingSphere.clone();
	}

	dispose(): void {
		this.root.traverse((node) => node.dispose());
		// Terminate the worker threads owned by this point cloud's loader.
		// The pool is created per-load (one OctreeLoader -> one WorkerPool),
		// so nothing else shares these workers.
		this.loader.workerPool.terminate();
		this.disposed = true;
	}

}
