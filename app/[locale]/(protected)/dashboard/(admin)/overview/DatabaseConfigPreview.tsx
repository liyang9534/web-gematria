import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { previewConfig } from "@/lib/db/config";
import {
  Database,
  Globe,
  Link as LinkIcon,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

export const DatabaseConfigPreview = () => {
  const configPreview = previewConfig();

  const { platform, database, summary } = configPreview;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Environment Status</CardTitle>
        <CardDescription>
          Auto-detected configuration for the current deployment.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>Deployment Platform</span>
          </div>
          <Badge variant="outline" className="font-mono capitalize w-fit">
            {platform}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Database Provider</span>
          </div>
          <Badge variant="outline" className="font-mono capitalize w-fit">
            {database}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Server className="h-4 w-4" />
            <span>Environment Type</span>
          </div>
          {summary.isServerless ? (
            <Badge variant="secondary" className="w-fit">
              Serverless
            </Badge>
          ) : (
            <Badge variant="default" className="w-fit">
              Server
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <LinkIcon className="h-4 w-4" />
            <span>Connection Pooling</span>
          </div>
          <Badge variant="secondary" className="w-fit">
            Not Used
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4" />
            <span>Prepared Statements</span>
          </div>
          {summary.preparedStatements ? (
            <Badge variant="default" className="w-fit">
              Enabled
            </Badge>
          ) : (
            <Badge variant="secondary" className="w-fit">
              Disabled
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>D1 Binding</span>
          </div>
          <Badge variant="default" className="font-mono w-fit">
            {summary.runtimeBinding}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
