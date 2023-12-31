export interface Ecs {
    name: string;
    resources: Resource[];
}

export interface Resource {
    kind: string;
    resources: ResourceStatus[];
}

export interface ResourceStatus {
    name: string;
    ready: string;
    synced: string;
    externalName: string;
}


export interface Condition {
    reason: string,
    status: string,
    type: string
}

export interface UpboundAwsCrd {
    apiVersion: string,
    kind: string,
    metadata: {
        name: string,
        annotations: {
            "crossplane.io/external-name": string
        }
        labels: {
            "app.kubernetes.io/part-of": string
        }
    }

    status: {
        atProvider: {
           arn: string
        }
        conditions: Condition[]
    }

}