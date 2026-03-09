import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Network, Activity, Key, RefreshCw, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface LatticeConfig {
  sovereign_lattice_url?: string;
  node_name?: string;
  node_id?: string;
}

type ConnectionStatus = "connected" | "disconnected" | "checking" | "error";

export default function SovereignLatticePanel() {
  const { toast } = useToast();
  const [config, setConfig] = useState<LatticeConfig>({});
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("checking");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Load config from database
  useEffect(() => {
    loadConfig();
    checkConnection();
  }, []);

  const loadConfig = async () => {
    const { data, error } = await supabase
      .from("lattice_config")
      .select("key, value");

    if (!error && data) {
      const configObj: LatticeConfig = {};
      data.forEach((row: { key: string; value: string }) => {
        configObj[row.key as keyof LatticeConfig] = row.value;
      });
      setConfig(configObj);
    }
  };

  const checkConnection = async () => {
    setIsCheckingConnection(true);
    setConnectionStatus("checking");

    try {
      // Try to reach Apex Bounty's sovereign lattice endpoint
      const response = await fetch(
        `https://uvhpmohzdwbbsldotszy.supabase.co/functions/v1/sovereign-lattice?action=ping`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setConnectionStatus("connected");
      } else if (response.status === 401) {
        // Endpoint exists but key required - still means network is reachable
        setConnectionStatus("connected");
      } else {
        setConnectionStatus("disconnected");
      }
    } catch (error) {
      console.error("Connection check failed:", error);
      setConnectionStatus("error");
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const triggerSync = async () => {
    setIsSyncing(true);

    try {
      const { data, error } = await supabase.functions.invoke("lattice-sync", {
        body: {
          event_type: "heartbeat",
          title: "Apex Infrastructure Heartbeat",
          description: "Manual sync triggered from Sovereign Lattice panel",
          severity: "low",
          payload: {
            triggered_by: "admin_panel",
            timestamp: new Date().toISOString(),
          },
        },
      });

      if (error) {
        throw error;
      }

      setLastSyncTime(new Date().toISOString());
      toast({
        title: "Sync Complete",
        description: "Event forwarded to Sovereign Lattice successfully.",
      });
    } catch (error) {
      console.error("Sync failed:", error);
      toast({
        title: "Sync Failed",
        description: error instanceof Error ? error.message : "Failed to sync with Sovereign Lattice",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "bg-primary";
      case "disconnected": return "bg-secondary";
      case "error": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case "connected": return <CheckCircle className="w-4 h-4 text-primary" />;
      case "disconnected": return <XCircle className="w-4 h-4 text-secondary-foreground" />;
      case "error": return <XCircle className="w-4 h-4 text-destructive" />;
      default: return <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Sovereign Lattice</CardTitle>
                <CardDescription className="text-sm">
                  Cross-platform intelligence network
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} animate-pulse`} />
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {connectionStatus}
              </span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Connection Status</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={checkConnection}
                disabled={isCheckingConnection}
              >
                {isCheckingConnection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Target</p>
                <p className="font-mono text-xs truncate">Apex Bounty</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <div className="flex items-center gap-1.5">
                  {getStatusIcon()}
                  <span className="capitalize">{connectionStatus}</span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground">Node ID</p>
                <p className="font-mono text-xs">{config.node_id || "apex-infrastructure"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Node Name</p>
                <p className="text-xs">{config.node_name || "Apex Infrastructure"}</p>
              </div>
            </div>
          </div>

          {/* Network Members */}
          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Lattice Network
            </Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/5 border-primary/30">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                Apex Bounty
              </Badge>
              <Badge variant="secondary" className="bg-secondary/50">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mr-2 animate-pulse" />
                Apex Infrastructure (this)
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mr-2" />
                Digital Gallows
              </Badge>
            </div>
          </div>

          {/* Manual Sync */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div>
              <p className="text-sm font-medium">Manual Sync</p>
              {lastSyncTime && (
                <p className="text-xs text-muted-foreground">
                  Last sync: {new Date(lastSyncTime).toLocaleTimeString()}
                </p>
              )}
            </div>
            <Button
              onClick={triggerSync}
              disabled={isSyncing || connectionStatus === "error"}
              className="gap-2"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Trigger Sync
                </>
              )}
            </Button>
          </div>

          {/* API Key Notice */}
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-start gap-2">
              <Key className="w-4 h-4 text-primary mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-primary">API Key Configuration</p>
                <p className="text-muted-foreground mt-1">
                  The APEX_LATTICE_KEY has been configured via environment secrets. 
                  Generate this key from Apex Bounty to enable cross-platform communication.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
