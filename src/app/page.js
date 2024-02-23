import Videos from "@/components/Videos";
import Shorts from "@/components/shorts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <main>
      <Tabs defaultValue="videos" className="full bg-[#333333]">
        <TabsList className="grid w-full grid-cols-2 bg-black fixed">
          <TabsTrigger value="videos" className="bg-black">
            Videos
          </TabsTrigger>
          <TabsTrigger value="reels" className="bg-black">
            Shorts
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="pt-10">
          <Videos />
        </TabsContent>
        <TabsContent value="reels" className="pt-10">
          <Shorts />
        </TabsContent>
      </Tabs>
      <div className="w-full"></div>
    </main>
  );
}
