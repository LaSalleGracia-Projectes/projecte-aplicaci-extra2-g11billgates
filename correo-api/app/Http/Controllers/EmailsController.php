<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Webklex\IMAP\Facades\Client;

class EmailsController extends Controller
{
    public function index()
    {
        try {
            $client = Client::account('default');
            $client->connect();

            $folder = $client->getFolder('INBOX');
            $messages = $folder->messages()->all()->limit(10)->get();

            $emails = [];

            foreach ($messages as $message) {
                $emails[] = [
                    'id' => $message->getUid(),
                    'username' => $message->getFrom()[0]->mail,
                    'question' => $message->getSubject()->get(),
                    'date' => $message->getDate()->get()->format('Y-m-d H:i:s'),
                ];
            }

            return response()->json($emails);
        } catch (\Exception $e) {
            Log::error("Error al obtener correos: " . $e->getMessage());
            return response()->json(['error' => 'No se pudieron obtener los correos'], 500);
        }
    }
}
